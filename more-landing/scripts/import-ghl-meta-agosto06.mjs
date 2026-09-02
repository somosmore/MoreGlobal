/**
 * Importa leads Meta (Taller Cambio de Estatus — 6 ago 2026) a GoHighLevel.
 *
 * - Lee el export de Meta en formato SpreadsheetML (.xls que en realidad es XML).
 * - Upsert por email: crea si no existe; si existe, añade tag sin pisar el resto.
 * - Tags: Taller-cambio-estatus-2026 (+ meta-agosto06 para trazabilidad)
 * - Crea oportunidad en pipeline taller si no hay una abierta del contacto.
 *
 * Uso (desde more-landing/):
 *   node scripts/import-ghl-meta-agosto06.mjs <ruta_xls> [--dry-run] [--limit=N]
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
const filePathArg = args.find((a) => !a.startsWith("--"))

if (!filePathArg) {
  console.error("Uso: node scripts/import-ghl-meta-agosto06.mjs <ruta_xls> [--dry-run]")
  process.exit(1)
}

const filePath = path.resolve(filePathArg)

function loadEnv() {
  const env = {}
  for (const rawLine of fs
    .readFileSync(path.join(PROJECT_ROOT, ".env"), "utf8")
    .split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    const eq = line.indexOf("=")
    if (eq < 0) continue
    env[line.slice(0, eq).trim()] = line
      .slice(eq + 1)
      .trim()
      .replace(/^["']|["']$/g, "")
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

const PRIMARY_TAG = "Taller-cambio-estatus-2026"
const SOURCE_TAG = "meta-agosto06"
const TAGS = [PRIMARY_TAG, SOURCE_TAG]
const SOURCE = "Meta Lead Ads — Taller Cambio de Estatus Agosto 6 2026"
const EVENT_LABEL = "Taller Cambio de Estatus"

const ghlHeaders = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  Version: "2021-07-28",
  "Content-Type": "application/json",
  Accept: "application/json",
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const decodeEntities = (value) =>
  value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&")

/** El export de Meta viene como SpreadsheetML, no como binario xls. */
function readSpreadsheet(xmlPath) {
  const xml = fs.readFileSync(xmlPath, "utf8")
  const rows = []

  for (const rowMatch of xml.matchAll(/<Row[^>]*>([\s\S]*?)<\/Row>/g)) {
    const cells = []
    for (const cellMatch of rowMatch[1].matchAll(/<Cell([^>]*)>([\s\S]*?)<\/Cell>/g)) {
      const indexMatch = cellMatch[1].match(/ss:Index="(\d+)"/)
      if (indexMatch) {
        while (cells.length < Number(indexMatch[1]) - 1) cells.push("")
      }
      const dataMatch = cellMatch[2].match(/<Data[^>]*>([\s\S]*?)<\/Data>/)
      cells.push(dataMatch ? decodeEntities(dataMatch[1]).trim() : "")
    }
    rows.push(cells)
  }

  const headers = rows[0] ?? []
  return rows
    .slice(1)
    .map((row) =>
      Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]))
    )
}

const CAMPAIGN_COUNTRY = {
  honduras: "HN",
  colombia: "CO",
  mexico: "MX",
  méxico: "MX",
  ecuador: "EC",
  peru: "PE",
  perú: "PE",
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
  if (p.startsWith("+593")) return "EC"
  if (p.startsWith("+57")) return "CO"
  if (p.startsWith("+52")) return "MX"
  if (p.startsWith("+51")) return "PE"
  if (p.startsWith("+58")) return "VE"
  if (p.startsWith("+54")) return "AR"
  if (p.startsWith("+56")) return "CL"
  if (p.startsWith("+34")) return "ES"
  if (p.startsWith("+1") && p.length >= 11) return "US"
  return null
}

function cleanPhone(raw) {
  if (!raw) return null
  let p = String(raw).trim().replace(/[\s\-()]/g, "")
  if (!p || !/\d/.test(p)) return null
  if (!p.startsWith("+")) p = `+${p.replace(/^\++/, "")}`
  return p
}

function splitName(fullName) {
  const parts = String(fullName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length === 0) return { firstName: "Lead", lastName: "Meta" }
  if (parts.length === 1) return { firstName: parts[0], lastName: "-" }
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") }
}

function parseLeads(records) {
  const byEmail = new Map()

  for (const row of records) {
    const email = String(row.email || "")
      .trim()
      .toLowerCase()
    if (!email || !email.includes("@")) continue
    if (byEmail.has(email)) continue

    const phone = cleanPhone(row.phone_number)
    const { firstName, lastName } = splitName(row.full_name)

    byEmail.set(email, {
      email,
      firstName,
      lastName,
      phone,
      country:
        countryFromCampaign(row.campaign_name) || detectCountryFromPhone(phone) || undefined,
      fullName: String(row.full_name || "").trim(),
      campaign: row.campaign_name || "",
      platform: row.platform || "",
      metaLeadId: row.id || "",
      createdTime: row.created_time || "",
    })
  }

  return [...byEmail.values()]
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
  return list.find((c) => (c.email || "").toLowerCase() === email) || null
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

  const res = await ghlFetch("https://services.leadconnectorhq.com/contacts/upsert", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  if (!res.ok) return { ok: false, status: res.status, body: text }

  const data = JSON.parse(text)
  return { ok: true, id: data?.contact?.id || null, contact: data?.contact || null }
}

async function addTags(contactId, tags) {
  const res = await ghlFetch(
    `https://services.leadconnectorhq.com/contacts/${contactId}/tags`,
    { method: "POST", body: JSON.stringify({ tags }) }
  )
  const text = await res.text()
  if (!res.ok) return { ok: false, status: res.status, body: text }
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
  const res = await ghlFetch("https://services.leadconnectorhq.com/opportunities/", {
    method: "POST",
    body: JSON.stringify({
      pipelineId: GHL_PIPELINE_ID,
      pipelineStageId: GHL_STAGE_ID,
      locationId: GHL_LOCATION_ID,
      contactId,
      name: `${name} — ${EVENT_LABEL}`,
      status: "open",
      monetaryValue: 0,
    }),
  })
  const text = await res.text()
  if (!res.ok) return { ok: false, status: res.status, body: text }
  const data = JSON.parse(text)
  return { ok: true, id: data?.opportunity?.id || null }
}

async function main() {
  if (!fs.existsSync(filePath)) {
    console.error(`No existe el archivo: ${filePath}`)
    process.exit(1)
  }

  const leads = parseLeads(readSpreadsheet(filePath))
  const toProcess = leads.slice(0, limit)

  console.log(`Archivo:   ${filePath}`)
  console.log(`Leads válidos únicos: ${leads.length}`)
  console.log(`A procesar: ${toProcess.length}`)
  console.log(`Modo:      ${dryRun ? "DRY-RUN" : "LIVE"}`)
  console.log(`Tags:      ${TAGS.join(", ")}`)
  console.log(`Pipeline:  ${GHL_PIPELINE_ID || "(ninguno)"} / Stage: ${GHL_STAGE_ID || "(ninguno)"}`)
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
        console.log(`${label} -> [DRY] ${action}${existing ? ` (${existing.id})` : ""}`)
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
      else console.log(`${label} -> tags FAIL (${tagRes.status}) ${tagRes.body}`)

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
          console.log(`${label} -> opp FAIL (${createdOpp.status}) ${createdOpp.body}`)
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
  const reportPath = path.join(outDir, `import-meta-agosto06-${ts}.json`)
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8")

  console.log("")
  console.log("===== RESUMEN =====")
  console.log(`Total procesados:         ${report.total}`)
  console.log(`Creados nuevos:           ${report.created}`)
  console.log(`Actualizados:             ${report.updated}`)
  console.log(`Tags aplicados:           ${report.tagged}`)
  console.log(`Oportunidades nuevas:     ${report.opportunitiesCreated}`)
  console.log(`Oportunidades existentes: ${report.opportunitiesExisting}`)
  console.log(`Fallidos:                 ${report.failed}`)
  console.log(`Reporte:                  ${reportPath}`)
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
