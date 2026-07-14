/**
 * Importa leads Meta (Masterclass / Taller 13 jul 2026) a GoHighLevel.
 *
 * - Upsert por email: crea si no existe; si existe, añade tag sin pisar el resto.
 * - Tag: taller-julio-2026 (+ meta-julio13 para trazabilidad)
 * - Crea oportunidad en pipeline taller si no hay una abierta del contacto.
 *
 * Uso (desde more-landing/):
 *   node scripts/import-ghl-meta-julio13.mjs [ruta_json] [--dry-run] [--limit=N]
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const limitArg = args.find((a) => a.startsWith("--limit="))
const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity
const jsonPathArg = args.find((a) => !a.startsWith("--"))
const jsonPath = path.resolve(
  jsonPathArg || path.join(__dirname, "reports", "meta-leads-julio13.json")
)

function loadEnv() {
  const envPath = path.join(PROJECT_ROOT, ".env")
  const raw = fs.readFileSync(envPath, "utf8")
  const env = {}
  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    const eq = line.indexOf("=")
    if (eq < 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    env[key] = value
  }
  return env
}

const env = loadEnv()
const GHL_API_KEY = env.GHL_API_KEY
const GHL_LOCATION_ID = env.GHL_LOCATION_ID
const GHL_PIPELINE_ID = env.GHL_TALLER_PIPELINE_ID || env.GHL_PIPELINE_ID
const GHL_STAGE_ID = env.GHL_TALLER_STAGE_ID || env.GHL_STAGE_ID

if (!GHL_API_KEY || !GHL_LOCATION_ID) {
  console.error("Faltan GHL_API_KEY o GHL_LOCATION_ID en .env")
  process.exit(1)
}

const PRIMARY_TAG = "taller-julio-2026"
const SOURCE_TAG = "meta-julio13"
const TAGS = [PRIMARY_TAG, SOURCE_TAG]
const SOURCE = "Meta Lead Ads — Masterclass Julio 13 2026"
const EVENT_LABEL = "Taller Red Flags — Julio 2026"

const ghlHeaders = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  Version: "2021-07-28",
  "Content-Type": "application/json",
  Accept: "application/json",
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const CAMPAIGN_COUNTRY = {
  honduras: "HN",
  colombia: "CO",
  mexico: "MX",
  ecuador: "EC",
}

function countryFromCampaign(campaignName) {
  const lower = String(campaignName || "").toLowerCase()
  for (const [key, iso] of Object.entries(CAMPAIGN_COUNTRY)) {
    if (lower.includes(key)) return iso
  }
  return null
}

function detectCountryFromPhone(phone) {
  if (!phone) return null
  const p = phone.startsWith("+") ? phone : `+${phone}`
  if (p.startsWith("+504")) return "HN"
  if (p.startsWith("+57")) return "CO"
  if (p.startsWith("+52")) return "MX"
  if (p.startsWith("+593")) return "EC"
  if (p.startsWith("+1") && p.length >= 11) return "US"
  if (p.startsWith("+51")) return "PE"
  if (p.startsWith("+58")) return "VE"
  if (p.startsWith("+54")) return "AR"
  if (p.startsWith("+56")) return "CL"
  return null
}

function cleanPhone(raw) {
  if (!raw) return null
  let p = String(raw).trim().replace(/[\s\-\(\)]/g, "")
  if (!p || !/[\d]/.test(p)) return null
  if (!p.startsWith("+")) p = `+${p.replace(/^\+/, "")}`
  return p
}

function splitName(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return { firstName: "Lead", lastName: "Meta" }
  if (parts.length === 1) return { firstName: parts[0], lastName: "-" }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  }
}

function parseLeads(raw) {
  return raw
    .map((row) => {
      const email = String(row.email || "")
        .trim()
        .toLowerCase()
      if (!email || !email.includes("@")) return null
      const phone = cleanPhone(row.phone_number)
      const { firstName, lastName } = splitName(row.full_name)
      const country =
        countryFromCampaign(row.campaign_name) ||
        detectCountryFromPhone(phone) ||
        undefined
      return {
        email,
        firstName,
        lastName,
        phone,
        country,
        fullName: String(row.full_name || "").trim(),
        campaign: row.campaign_name || "",
        platform: row.platform || "",
        metaLeadId: row.id || "",
        createdTime: row.created_time || "",
      }
    })
    .filter(Boolean)
}

async function ghlFetch(url, options = {}, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(url, {
      ...options,
      headers: { ...ghlHeaders, ...(options.headers || {}) },
    })
    if (res.status === 429 || res.status >= 500) {
      await sleep(1000 * (attempt + 1))
      continue
    }
    return res
  }
  throw new Error(`GHL request failed after ${retries} retries: ${url}`)
}

async function findContactByEmail(email) {
  const url = `https://services.leadconnectorhq.com/contacts/?locationId=${encodeURIComponent(
    GHL_LOCATION_ID
  )}&query=${encodeURIComponent(email)}&limit=10`
  const res = await ghlFetch(url, { method: "GET" })
  const text = await res.text()
  if (!res.ok) throw new Error(`Search ${email} failed (${res.status}): ${text}`)
  const data = JSON.parse(text)
  const list = Array.isArray(data?.contacts) ? data.contacts : []
  return (
    list.find((c) => (c.email || "").toLowerCase() === email.toLowerCase()) ||
    null
  )
}

async function upsertContact(c) {
  const payload = {
    locationId: GHL_LOCATION_ID,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    source: SOURCE,
  }
  if (c.phone) payload.phone = c.phone
  if (c.country) payload.country = c.country

  const res = await ghlFetch(
    "https://services.leadconnectorhq.com/contacts/upsert",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  )
  const text = await res.text()
  if (!res.ok) {
    return { ok: false, status: res.status, body: text }
  }
  const data = JSON.parse(text)
  return {
    ok: true,
    id: data?.contact?.id || null,
    new: Boolean(data?.new || data?.contact?.dateAdded),
    contact: data?.contact || null,
  }
}

async function addTags(contactId, tags) {
  const res = await ghlFetch(
    `https://services.leadconnectorhq.com/contacts/${contactId}/tags`,
    {
      method: "POST",
      body: JSON.stringify({ tags }),
    }
  )
  const text = await res.text()
  if (!res.ok) {
    return { ok: false, status: res.status, body: text }
  }
  return { ok: true }
}

async function findOpenOpportunity(contactId) {
  if (!GHL_PIPELINE_ID) return null
  const url = `https://services.leadconnectorhq.com/opportunities/search?location_id=${encodeURIComponent(
    GHL_LOCATION_ID
  )}&contact_id=${encodeURIComponent(contactId)}&pipeline_id=${encodeURIComponent(
    GHL_PIPELINE_ID
  )}&status=open&limit=5`
  const res = await ghlFetch(url, { method: "GET" })
  const text = await res.text()
  if (!res.ok) return null
  const data = JSON.parse(text)
  const list = Array.isArray(data?.opportunities) ? data.opportunities : []
  return list[0] || null
}

async function createOpportunity(contactId, name) {
  if (!GHL_PIPELINE_ID || !GHL_STAGE_ID) {
    return { ok: false, skipped: true, reason: "missing_pipeline" }
  }
  const payload = {
    pipelineId: GHL_PIPELINE_ID,
    pipelineStageId: GHL_STAGE_ID,
    locationId: GHL_LOCATION_ID,
    contactId,
    name: `${name} — ${EVENT_LABEL}`,
    status: "open",
    monetaryValue: 0,
  }
  const res = await ghlFetch(
    "https://services.leadconnectorhq.com/opportunities/",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  )
  const text = await res.text()
  if (!res.ok) {
    return { ok: false, status: res.status, body: text }
  }
  const data = JSON.parse(text)
  return { ok: true, id: data?.opportunity?.id || null }
}

async function main() {
  if (!fs.existsSync(jsonPath)) {
    console.error(`No existe el archivo: ${jsonPath}`)
    process.exit(1)
  }

  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"))
  const leads = parseLeads(raw)
  const toProcess = leads.slice(0, limit)

  console.log(`Archivo: ${jsonPath}`)
  console.log(`Leads válidos: ${leads.length}`)
  console.log(`A procesar: ${toProcess.length}`)
  console.log(`Modo: ${dryRun ? "DRY-RUN" : "LIVE"}`)
  console.log(`Tags: ${TAGS.join(", ")}`)
  console.log(
    `Pipeline: ${GHL_PIPELINE_ID || "(ninguno)"} / Stage: ${GHL_STAGE_ID || "(ninguno)"}`
  )
  console.log("")

  const report = {
    total: 0,
    created: 0,
    updated: 0,
    tagged: 0,
    opportunitiesCreated: 0,
    opportunitiesExisting: 0,
    failed: 0,
    rows: [],
  }

  for (let i = 0; i < toProcess.length; i++) {
    const c = toProcess[i]
    report.total++
    const label = `[${i + 1}/${toProcess.length}] ${c.email}`

    try {
      const existing = await findContactByEmail(c.email)
      await sleep(200)

      if (dryRun) {
        const action = existing ? "would_update" : "would_create"
        console.log(
          `${label} -> [DRY] ${action}${existing ? ` (${existing.id})` : ""}`
        )
        if (existing) report.updated++
        else report.created++
        report.rows.push({ ...c, result: action, ghlId: existing?.id || null })
        continue
      }

      const upsert = await upsertContact(c)
      await sleep(220)
      if (!upsert.ok) {
        console.log(`${label} -> FAIL upsert (${upsert.status}) ${upsert.body}`)
        report.failed++
        report.rows.push({
          ...c,
          result: "upsert_failed",
          error: `${upsert.status} ${upsert.body}`,
        })
        continue
      }

      const contactId = upsert.id
      const wasNew = !existing
      if (wasNew) report.created++
      else report.updated++

      const tagRes = await addTags(contactId, TAGS)
      await sleep(180)
      if (tagRes.ok) report.tagged++
      else {
        console.log(
          `${label} -> upsert ok pero tags FAIL (${tagRes.status}) ${tagRes.body}`
        )
      }

      let oppResult = "skipped"
      const openOpp = await findOpenOpportunity(contactId)
      await sleep(180)
      if (openOpp) {
        report.opportunitiesExisting++
        oppResult = "opp_exists"
      } else {
        const createdOpp = await createOpportunity(
          contactId,
          c.fullName || `${c.firstName} ${c.lastName}`
        )
        await sleep(180)
        if (createdOpp.ok) {
          report.opportunitiesCreated++
          oppResult = "opp_created"
        } else if (createdOpp.skipped) {
          oppResult = "opp_skipped_config"
        } else {
          oppResult = `opp_failed_${createdOpp.status}`
          console.log(
            `${label} -> opp FAIL (${createdOpp.status}) ${createdOpp.body}`
          )
        }
      }

      console.log(
        `${label} -> ${wasNew ? "CREADO" : "ACTUALIZADO"} (${contactId}) tags=${tagRes.ok ? "ok" : "fail"} ${oppResult}`
      )
      report.rows.push({
        ...c,
        result: wasNew ? "created" : "updated",
        ghlId: contactId,
        tagsOk: tagRes.ok,
        opportunity: oppResult,
      })
    } catch (err) {
      console.log(`${label} -> ERROR ${err.message}`)
      report.failed++
      report.rows.push({ ...c, result: "error", error: err.message })
      await sleep(300)
    }
  }

  const outDir = path.join(PROJECT_ROOT, "scripts", "reports")
  fs.mkdirSync(outDir, { recursive: true })
  const ts = new Date().toISOString().replace(/[:.]/g, "-")
  const reportPath = path.join(outDir, `import-meta-julio13-${ts}.json`)
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8")

  console.log("")
  console.log("===== RESUMEN =====")
  console.log(`Total procesados:       ${report.total}`)
  console.log(`Creados nuevos:         ${report.created}`)
  console.log(`Actualizados:           ${report.updated}`)
  console.log(`Tags aplicados:         ${report.tagged}`)
  console.log(`Oportunidades nuevas:   ${report.opportunitiesCreated}`)
  console.log(`Oportunidades existentes: ${report.opportunitiesExisting}`)
  console.log(`Fallidos:               ${report.failed}`)
  console.log(`Reporte:                ${reportPath}`)
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
