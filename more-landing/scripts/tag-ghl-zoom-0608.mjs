/**
 * Etiqueta en GHL a los inscritos del Zoom (CSV de registro) con "zoom 06-08-2026".
 * - Si existe el contacto (por email): solo añade el tag.
 * - Si no existe: lo crea con el tag.
 *
 * Uso (desde more-landing/):
 *   node scripts/tag-ghl-zoom-0608.mjs <ruta_csv> [--dry-run] [--limit=N]
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
const csvPathArg = args.find((a) => !a.startsWith("--"))

if (!csvPathArg) {
  console.error("Uso: node scripts/tag-ghl-zoom-0608.mjs <ruta_csv> [--dry-run]")
  process.exit(1)
}

const csvPath = path.resolve(csvPathArg)

function loadEnv() {
  const env = {}
  for (const rawLine of fs.readFileSync(path.join(PROJECT_ROOT, ".env"), "utf8").split(/\r?\n/)) {
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
if (!GHL_API_KEY || !GHL_LOCATION_ID) {
  console.error("Faltan GHL_API_KEY o GHL_LOCATION_ID en .env")
  process.exit(1)
}

const TAG = "zoom 06-08-2026"
const SOURCE = "Zoom — Estrategias para cambio de estatus 06 ago 2026"

const ghlHeaders = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  Version: "2021-07-28",
  "Content-Type": "application/json",
  Accept: "application/json",
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function parseCsvLine(line) {
  const fields = []
  let cur = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"'
        i++
      } else if (c === '"') {
        inQuotes = false
      } else {
        cur += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ",") {
      fields.push(cur)
      cur = ""
    } else {
      cur += c
    }
  }
  fields.push(cur)
  return fields.map((f) => f.trim())
}

function cleanPhone(raw, countryIso) {
  if (!raw) return null
  let p = String(raw).trim()
  if (!p) return null
  if (p.startsWith('="') && p.endsWith('"')) p = p.slice(2, -1)
  if (p.startsWith("'")) p = p.slice(1)
  p = p.replace(/[\s\-()]/g, "")
  if (!p || !/\d/.test(p)) return null

  if (p.startsWith("+")) return p

  const dial = {
    CO: "57",
    MX: "52",
    EC: "593",
    PE: "51",
    HN: "504",
    US: "1",
    AR: "54",
    CL: "56",
    VE: "58",
  }[String(countryIso || "").toUpperCase()]

  if (dial && !p.startsWith(dial)) return `+${dial}${p}`
  return `+${p}`
}

function parseZoomCsv(text) {
  const lines = text.split(/\r?\n/)
  const byEmail = new Map()
  let inAttendees = false

  for (const line of lines) {
    if (!line.trim()) continue
    if (line.startsWith("Nombre,Apellido,Correo")) {
      inAttendees = true
      continue
    }
    if (!inAttendees) continue

    const f = parseCsvLine(line)
    // Nombre, Apellido, Correo, Hora, Estado, Ciudad, País, Teléfono, Sector
    if (f.length < 3) continue
    const email = String(f[2] || "")
      .trim()
      .toLowerCase()
    if (!email || !email.includes("@")) continue
    if (byEmail.has(email)) continue

    const country = String(f[6] || "").trim().toUpperCase() || null
    byEmail.set(email, {
      firstName: String(f[0] || "Lead").trim() || "Lead",
      lastName: String(f[1] || "-").trim() || "-",
      email,
      status: String(f[4] || "").trim(),
      country: country && country.length === 2 ? country : null,
      phone: cleanPhone(f[7], country),
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
  if (!res.ok) {
    // retry without phone if invalid calling code
    if (String(text).includes("Invalid country calling code") && c.phone) {
      delete payload.phone
      const res2 = await ghlFetch("https://services.leadconnectorhq.com/contacts/upsert", {
        method: "POST",
        body: JSON.stringify(payload),
      })
      const text2 = await res2.text()
      if (!res2.ok) return { ok: false, status: res2.status, body: text2 }
      return { ok: true, id: JSON.parse(text2)?.contact?.id || null }
    }
    return { ok: false, status: res.status, body: text }
  }
  return { ok: true, id: JSON.parse(text)?.contact?.id || null }
}

async function addTag(contactId) {
  const res = await ghlFetch(
    `https://services.leadconnectorhq.com/contacts/${contactId}/tags`,
    { method: "POST", body: JSON.stringify({ tags: [TAG] }) }
  )
  const text = await res.text()
  if (!res.ok) return { ok: false, status: res.status, body: text }
  return { ok: true }
}

async function main() {
  if (!fs.existsSync(csvPath)) {
    console.error(`No existe: ${csvPath}`)
    process.exit(1)
  }

  const contacts = parseZoomCsv(fs.readFileSync(csvPath, "utf8"))
  const toProcess = contacts.slice(0, limit)

  console.log(`Archivo:  ${csvPath}`)
  console.log(`Únicos:   ${contacts.length}`)
  console.log(`Procesar: ${toProcess.length}`)
  console.log(`Tag:      ${TAG}`)
  console.log(`Modo:     ${dryRun ? "DRY-RUN" : "LIVE"}`)
  console.log("")

  const report = {
    total: 0,
    taggedExisting: 0,
    createdAndTagged: 0,
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
        console.log(`${label} -> [DRY] ${existing ? `tag existing (${existing.id})` : "create+tag"}`)
        if (existing) report.taggedExisting++
        else report.createdAndTagged++
        continue
      }

      let contactId = existing?.id || null
      let created = false

      if (!contactId) {
        const upsert = await upsertContact(c)
        await sleep(220)
        if (!upsert.ok) {
          console.log(`${label} -> FAIL upsert (${upsert.status}) ${upsert.body}`)
          report.failed++
          report.rows.push({ ...c, result: "upsert_failed", error: upsert.body })
          continue
        }
        contactId = upsert.id
        created = true
      }

      const tagRes = await addTag(contactId)
      await sleep(180)
      if (!tagRes.ok) {
        console.log(`${label} -> FAIL tag (${tagRes.status}) ${tagRes.body}`)
        report.failed++
        report.rows.push({ ...c, result: "tag_failed", ghlId: contactId, error: tagRes.body })
        continue
      }

      if (created) report.createdAndTagged++
      else report.taggedExisting++

      console.log(`${label} -> ${created ? "CREADO+TAG" : "TAG"} (${contactId})`)
      report.rows.push({
        ...c,
        result: created ? "created_tagged" : "tagged",
        ghlId: contactId,
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
  const reportPath = path.join(outDir, `tag-zoom-0608-${ts}.json`)
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8")

  console.log("")
  console.log("===== RESUMEN =====")
  console.log(`Total:              ${report.total}`)
  console.log(`Tag en existentes:  ${report.taggedExisting}`)
  console.log(`Creados + tag:      ${report.createdAndTagged}`)
  console.log(`Fallidos:           ${report.failed}`)
  console.log(`Reporte:            ${reportPath}`)
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
