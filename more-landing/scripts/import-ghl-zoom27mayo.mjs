// Importador one-shot de inscritos del Zoom (Profesional Expansión Week - Clase 2)
// a GoHighLevel.
//
// Reglas:
// - Si el contacto ya existe (match por email) -> SKIP (no se actualiza).
// - Si no existe -> se crea con los tags: "webinar-eb2niw-2026" + "zoom27Mayo".
// - Throttle ~250ms entre requests para respetar rate limit de GHL.
//
// Uso (desde more-landing/):
//   node scripts/import-ghl-zoom27mayo.mjs <ruta_csv> [--dry-run] [--limit=N]

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")

// ---------- Args ----------
const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const limitArg = args.find((a) => a.startsWith("--limit="))
const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity
const csvPathArg = args.find((a) => !a.startsWith("--"))
if (!csvPathArg) {
  console.error("Uso: node scripts/import-ghl-zoom27mayo.mjs <ruta_csv> [--dry-run] [--limit=N]")
  process.exit(1)
}
const csvPath = path.resolve(csvPathArg)

// ---------- Env ----------
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
if (!GHL_API_KEY || !GHL_LOCATION_ID) {
  console.error("Faltan GHL_API_KEY o GHL_LOCATION_ID en .env")
  process.exit(1)
}

const TAGS = ["webinar-eb2niw-2026", "zoom27Mayo"]
const SOURCE = "Zoom Webinar 27Mayo - Profesional Expansion Week"

const ghlHeaders = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  Version: "2021-07-28",
  "Content-Type": "application/json",
  Accept: "application/json",
}

// ---------- CSV parser ----------
// Maneja campos con comillas dobles, escape de Excel ="..." y apostrofe inicial.
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
    } else {
      if (c === '"') {
        inQuotes = true
      } else if (c === ",") {
        fields.push(cur)
        cur = ""
      } else {
        cur += c
      }
    }
  }
  fields.push(cur)
  return fields.map((f) => f.trim())
}

function cleanPhone(raw) {
  if (!raw) return null
  let p = String(raw).trim()
  if (!p) return null
  if (p.startsWith('="') && p.endsWith('"')) p = p.slice(2, -1)
  if (p.startsWith("'")) p = p.slice(1)
  p = p.replace(/[\s\-\(\)]/g, "")
  if (!p || p === "." || p === "+") return null
  if (!/[\d]/.test(p)) return null
  return p
}

// Detecta país por prefijo telefónico (best-effort).
function detectCountry(phone) {
  if (!phone) return null
  const p = phone.startsWith("+") ? phone : `+${phone}`
  if (p.startsWith("+1") && p.length >= 11) return "US"
  if (p.startsWith("+52")) return "MX"
  if (p.startsWith("+57")) return "CO"
  if (p.startsWith("+51")) return "PE"
  if (p.startsWith("+593")) return "EC"
  if (p.startsWith("+504")) return "HN"
  if (p.startsWith("+503")) return "SV"
  if (p.startsWith("+502")) return "GT"
  if (p.startsWith("+505")) return "NI"
  if (p.startsWith("+506")) return "CR"
  if (p.startsWith("+507")) return "PA"
  if (p.startsWith("+591")) return "BO"
  if (p.startsWith("+595")) return "PY"
  if (p.startsWith("+598")) return "UY"
  if (p.startsWith("+54")) return "AR"
  if (p.startsWith("+56")) return "CL"
  if (p.startsWith("+58")) return "VE"
  if (p.startsWith("+1809") || p.startsWith("+1829") || p.startsWith("+1849")) return "DO"
  return null
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/)
  const contacts = []
  let inAttendees = false
  for (const line of lines) {
    if (!line.trim()) continue
    if (line.startsWith("Nombre,Apellido,Correo")) {
      inAttendees = true
      continue
    }
    if (!inAttendees) continue
    const fields = parseCsvLine(line)
    if (fields.length < 6) continue
    const [firstName, lastName, email, , status, phoneRaw] = fields
    if (!email || !email.includes("@")) continue
    contacts.push({
      firstName: firstName.trim(),
      lastName: lastName.trim() || "-",
      email: email.trim().toLowerCase(),
      status: (status || "").trim(),
      phone: cleanPhone(phoneRaw),
    })
  }
  return contacts
}

// ---------- GHL helpers ----------
async function ghlFetch(url, options = {}, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(url, { ...options, headers: { ...ghlHeaders, ...(options.headers || {}) } })
    if (res.status === 429 || res.status >= 500) {
      const wait = 1000 * (attempt + 1)
      await new Promise((r) => setTimeout(r, wait))
      continue
    }
    return res
  }
  throw new Error(`GHL request failed after ${retries} retries`)
}

async function findContactByEmail(email) {
  const url = `https://services.leadconnectorhq.com/contacts/?locationId=${encodeURIComponent(
    GHL_LOCATION_ID
  )}&query=${encodeURIComponent(email)}&limit=5`
  const res = await ghlFetch(url, { method: "GET" })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Search ${email} failed (${res.status}): ${body}`)
  }
  const data = await res.json()
  const list = Array.isArray(data?.contacts) ? data.contacts : []
  const match = list.find(
    (c) => (c.email || "").toLowerCase() === email.toLowerCase()
  )
  return match || null
}

async function createContact(c) {
  const payload = {
    locationId: GHL_LOCATION_ID,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    source: SOURCE,
    tags: TAGS,
  }
  if (c.phone) payload.phone = c.phone
  const country = detectCountry(c.phone)
  if (country) payload.country = country

  const res = await ghlFetch("https://services.leadconnectorhq.com/contacts/", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  if (!res.ok) {
    let parsed = null
    try {
      parsed = JSON.parse(text)
    } catch {
      // ignore
    }
    if (
      res.status === 400 &&
      parsed?.message &&
      /duplicated contacts/i.test(parsed.message)
    ) {
      return {
        ok: false,
        duplicate: true,
        matchingField: parsed?.meta?.matchingField || "unknown",
        existingId: parsed?.meta?.contactId || null,
        status: res.status,
        body: text,
      }
    }
    return { ok: false, status: res.status, body: text }
  }
  try {
    const data = JSON.parse(text)
    return { ok: true, id: data?.contact?.id || null, body: data }
  } catch {
    return { ok: true, id: null, body: text }
  }
}

// ---------- Main ----------
async function main() {
  console.log(`Leyendo CSV: ${csvPath}`)
  const csv = fs.readFileSync(csvPath, "utf8")
  const contacts = parseCsv(csv)
  console.log(`Contactos encontrados en CSV: ${contacts.length}`)
  console.log(`Modo: ${dryRun ? "DRY-RUN (no crea nada)" : "LIVE (crea contactos)"}`)
  console.log(`Tags a aplicar: ${TAGS.join(", ")}`)
  console.log("")

  const report = {
    total: 0,
    skippedExisting: 0,
    created: 0,
    failed: 0,
    skippedInvalid: 0,
    rows: [],
  }

  const seenEmails = new Set()
  const toProcess = contacts.slice(0, limit)
  for (let i = 0; i < toProcess.length; i++) {
    const c = toProcess[i]
    report.total++

    if (seenEmails.has(c.email)) {
      console.log(`[${i + 1}/${toProcess.length}] ${c.email} -> DUPLICADO en CSV, salto`)
      report.skippedInvalid++
      report.rows.push({ ...c, result: "duplicate_in_csv" })
      continue
    }
    seenEmails.add(c.email)

    if (!c.firstName) {
      console.log(`[${i + 1}/${toProcess.length}] ${c.email} -> sin nombre, salto`)
      report.skippedInvalid++
      report.rows.push({ ...c, result: "missing_name" })
      continue
    }

    try {
      const existing = await findContactByEmail(c.email)
      if (existing) {
        console.log(
          `[${i + 1}/${toProcess.length}] ${c.email} -> EXISTE (${existing.id}), salto`
        )
        report.skippedExisting++
        report.rows.push({ ...c, result: "exists", ghlId: existing.id })
        await sleep(220)
        continue
      }

      if (dryRun) {
        console.log(`[${i + 1}/${toProcess.length}] ${c.email} -> [DRY] crearia`)
        report.created++
        report.rows.push({ ...c, result: "would_create" })
      } else {
        const r = await createContact(c)
        if (r.ok) {
          console.log(
            `[${i + 1}/${toProcess.length}] ${c.email} -> CREADO (${r.id})`
          )
          report.created++
          report.rows.push({ ...c, result: "created", ghlId: r.id })
        } else if (r.duplicate) {
          console.log(
            `[${i + 1}/${toProcess.length}] ${c.email} -> EXISTE por ${r.matchingField} (${r.existingId}), salto`
          )
          report.skippedExisting++
          report.rows.push({
            ...c,
            result: "exists_by_" + r.matchingField,
            ghlId: r.existingId,
          })
        } else {
          console.log(
            `[${i + 1}/${toProcess.length}] ${c.email} -> FAIL (${r.status}) ${r.body}`
          )
          report.failed++
          report.rows.push({ ...c, result: "failed", error: `${r.status} ${r.body}` })
        }
      }
    } catch (err) {
      console.log(`[${i + 1}/${toProcess.length}] ${c.email} -> ERROR ${err.message}`)
      report.failed++
      report.rows.push({ ...c, result: "error", error: err.message })
    }

    await sleep(280)
  }

  // ---------- Persist report ----------
  const outDir = path.join(PROJECT_ROOT, "scripts", "reports")
  fs.mkdirSync(outDir, { recursive: true })
  const ts = new Date().toISOString().replace(/[:.]/g, "-")
  const reportPath = path.join(outDir, `import-zoom27mayo-${ts}.json`)
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8")

  console.log("")
  console.log("===== RESUMEN =====")
  console.log(`Total procesados:     ${report.total}`)
  console.log(`Creados nuevos:       ${report.created}`)
  console.log(`Ya existian (skip):   ${report.skippedExisting}`)
  console.log(`Invalidos (skip):     ${report.skippedInvalid}`)
  console.log(`Fallidos:             ${report.failed}`)
  console.log(`Reporte:              ${reportPath}`)
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
