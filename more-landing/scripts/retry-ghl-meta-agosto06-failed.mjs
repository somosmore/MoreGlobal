/**
 * Reintenta los 3 leads de agosto06 que fallaron por teléfono inválido.
 * Corrige códigos de país (EC 09… → +593; US 832… → +1) y aplica tags + oportunidad.
 *
 * Uso: node scripts/retry-ghl-meta-agosto06-failed.mjs [--dry-run]
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")
const dryRun = process.argv.includes("--dry-run")

function loadEnv() {
  const env = {}
  for (const rawLine of fs.readFileSync(path.join(PROJECT_ROOT, ".env"), "utf8").split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    const eq = line.indexOf("=")
    if (eq < 0) continue
    env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim().replace(/^["']|["']$/g, "")
  }
  return env
}

const env = loadEnv()
const GHL_API_KEY = env.GHL_API_KEY
const GHL_LOCATION_ID = env.GHL_LOCATION_ID
const GHL_PIPELINE_ID = env.GHL_TALLER_PIPELINE_ID || env.GHL_PIPELINE_ID
const GHL_STAGE_ID = env.GHL_TALLER_STAGE_ID || env.GHL_STAGE_ID

const TAGS = ["Taller-cambio-estatus-2026", "meta-agosto06"]
const SOURCE = "Meta Lead Ads — Taller Cambio de Estatus Agosto 6 2026"
const EVENT_LABEL = "Taller Cambio de Estatus"

const LEADS = [
  {
    email: "alarcontours_contabilidad@hotmail.com",
    firstName: "Adriana",
    lastName: "Natalia",
    phone: "+593988407209",
    country: "EC",
    fullName: "Adriana Natalia",
  },
  {
    email: "david_darkmaster16@hotmail.com",
    firstName: "David",
    lastName: "Carrera",
    phone: "+593967076683",
    country: "EC",
    fullName: "David Carrera",
  },
  {
    email: "belkys2010@hotmail.com",
    firstName: "Belkys",
    lastName: "Liana Murillo Ramos",
    phone: "+18324984203",
    country: "US",
    fullName: "Belkys Liana Murillo Ramos",
  },
]

const headers = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  Version: "2021-07-28",
  "Content-Type": "application/json",
  Accept: "application/json",
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function ghlFetch(url, options = {}) {
  const res = await fetch(url, { ...options, headers: { ...headers, ...(options.headers || {}) } })
  const text = await res.text()
  return { ok: res.ok, status: res.status, text, json: () => JSON.parse(text) }
}

async function main() {
  console.log(`Retry ${LEADS.length} leads | ${dryRun ? "DRY-RUN" : "LIVE"}`)
  for (const c of LEADS) {
    console.log(`\n→ ${c.email} (${c.phone})`)
    if (dryRun) continue

    const upsert = await ghlFetch("https://services.leadconnectorhq.com/contacts/upsert", {
      method: "POST",
      body: JSON.stringify({
        locationId: GHL_LOCATION_ID,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        phone: c.phone,
        country: c.country,
        source: SOURCE,
      }),
    })
    await sleep(250)
    if (!upsert.ok) {
      console.log(`  upsert FAIL (${upsert.status}) ${upsert.text}`)
      // fallback sin teléfono
      const upsert2 = await ghlFetch("https://services.leadconnectorhq.com/contacts/upsert", {
        method: "POST",
        body: JSON.stringify({
          locationId: GHL_LOCATION_ID,
          firstName: c.firstName,
          lastName: c.lastName,
          email: c.email,
          country: c.country,
          source: SOURCE,
        }),
      })
      await sleep(250)
      if (!upsert2.ok) {
        console.log(`  upsert sin phone FAIL (${upsert2.status}) ${upsert2.text}`)
        continue
      }
      const data2 = upsert2.json()
      const id2 = data2?.contact?.id
      console.log(`  upsert sin phone OK (${id2})`)
      await tagAndOpp(id2, c.fullName)
      continue
    }

    const data = upsert.json()
    const id = data?.contact?.id
    console.log(`  upsert OK (${id})`)
    await tagAndOpp(id, c.fullName)
  }
}

async function tagAndOpp(contactId, name) {
  const tagRes = await ghlFetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tags`, {
    method: "POST",
    body: JSON.stringify({ tags: TAGS }),
  })
  await sleep(200)
  console.log(`  tags ${tagRes.ok ? "ok" : `FAIL ${tagRes.status}`}`)

  const search = await ghlFetch(
    `https://services.leadconnectorhq.com/opportunities/search?location_id=${encodeURIComponent(
      GHL_LOCATION_ID
    )}&contact_id=${encodeURIComponent(contactId)}&pipeline_id=${encodeURIComponent(
      GHL_PIPELINE_ID
    )}&status=open&limit=5`
  )
  await sleep(200)
  const list = search.ok ? search.json()?.opportunities || [] : []
  if (list.length) {
    console.log(`  opp exists`)
    return
  }

  const opp = await ghlFetch("https://services.leadconnectorhq.com/opportunities/", {
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
  await sleep(200)
  console.log(`  opp ${opp.ok ? "created" : `FAIL ${opp.status} ${opp.text}`}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
