/**
 * Migra contactos del tag taller-junio-2026 → taller-julio-2026 en GHL.
 *
 * Uso (desde more-landing/):
 *   node scripts/migrate-ghl-taller-tag.mjs [--dry-run]
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")
const dryRun = process.argv.includes("--dry-run")

const OLD_TAG = "taller-junio-2026"
const NEW_TAG = "taller-julio-2026"

function loadEnv() {
  const envPath = path.join(PROJECT_ROOT, ".env")
  const raw = fs.readFileSync(envPath, "utf8")
  const env = {}
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith("#")) continue
    const eq = t.indexOf("=")
    if (eq < 0) continue
    env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^"|"$/g, "")
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

const headers = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  Version: "2021-07-28",
  "Content-Type": "application/json",
  Accept: "application/json",
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function findContactsWithOldTag() {
  const contacts = new Map()
  let url = `https://services.leadconnectorhq.com/opportunities/search?location_id=${encodeURIComponent(GHL_LOCATION_ID)}&q=${encodeURIComponent("Taller Red Flags")}&limit=100`

  while (url) {
    const res = await fetch(url, { headers })
    const data = await res.json()
    if (!res.ok) throw new Error(`Opportunity search failed: ${JSON.stringify(data)}`)

    for (const opp of data.opportunities ?? []) {
      const c = opp.contact ?? opp.relations?.[0]
      const contactId = opp.contactId ?? c?.recordId ?? c?.id
      if (!contactId) continue
      const tags = (c?.tags ?? opp.relations?.[0]?.tags ?? []).map((t) =>
        String(t).toLowerCase()
      )
      contacts.set(contactId, {
        id: contactId,
        email: c?.email ?? opp.relations?.[0]?.email ?? "",
        name: c?.name ?? opp.relations?.[0]?.contactName ?? "",
        tags,
      })
    }
    url = data.meta?.nextPageUrl || null
  }

  // También buscar por emails conocidos del taller (Supabase source)
  const knownEmails = [
    "yurichapar@gmail.com",
    "linsym27@gmail.com",
    "briamsolorzano@hotmail.com",
    "sandra@justmore.net",
    "aguilar_kdj@hotmail.com",
    "jhonathan88@hotmail.com",
    "cristy_joha@hotmail.com",
    "jvbg321@gmail.com",
    "emelmejia1960@gmail.com",
    "cofradia2000@hotmail.com",
    "marcelogrl16@gmail.com",
    "srebaza@gmail.com",
    "carloshmercador@gmail.com",
    "cele.cortes12@outlook.com",
    "jfpinto69@gmail.com",
    "msmorales29@gmail.com",
  ]

  for (const email of knownEmails) {
    const res = await fetch(
      `https://services.leadconnectorhq.com/contacts/?locationId=${encodeURIComponent(GHL_LOCATION_ID)}&query=${encodeURIComponent(email)}&limit=3`,
      { headers }
    )
    const data = await res.json()
    for (const c of data.contacts ?? []) {
      if (c.email?.toLowerCase() !== email.toLowerCase()) continue
      contacts.set(c.id, {
        id: c.id,
        email: c.email,
        name: c.contactName ?? c.firstName ?? "",
        tags: (c.tags ?? []).map((t) => String(t).toLowerCase()),
      })
    }
    await sleep(200)
  }

  return [...contacts.values()].filter((c) =>
    c.tags.some((t) => t === OLD_TAG || t === OLD_TAG.replace("taller-", "Taller-"))
  )
}

async function addTag(contactId) {
  const res = await fetch(
    `https://services.leadconnectorhq.com/contacts/${contactId}/tags`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ tags: [NEW_TAG] }),
    }
  )
  const text = await res.text()
  if (!res.ok) throw new Error(`Add tag ${contactId}: ${text}`)
}

async function removeTag(contactId) {
  const res = await fetch(
    `https://services.leadconnectorhq.com/contacts/${contactId}/tags`,
    {
      method: "DELETE",
      headers,
      body: JSON.stringify({ tags: [OLD_TAG] }),
    }
  )
  const text = await res.text()
  if (!res.ok) throw new Error(`Remove tag ${contactId}: ${text}`)
}

async function main() {
  console.log(dryRun ? "=== DRY RUN ===" : "=== Migración tag taller GHL ===")
  console.log(`${OLD_TAG} → ${NEW_TAG}\n`)

  const contacts = await findContactsWithOldTag()
  console.log(`Contactos con tag "${OLD_TAG}": ${contacts.length}\n`)

  if (contacts.length === 0) {
    console.log("Nada que migrar.")
    return
  }

  let ok = 0
  let fail = 0

  for (const c of contacts) {
    if (dryRun) {
      console.log(`• ${c.email || c.name} (${c.id})`)
      ok++
      continue
    }

    try {
      await addTag(c.id)
      await removeTag(c.id)
      console.log(`✅ ${c.email || c.name}`)
      ok++
      await sleep(250)
    } catch (err) {
      console.error(`❌ ${c.email || c.name}: ${err.message}`)
      fail++
    }
  }

  console.log(`\nListo: ${ok} migrados, ${fail} errores.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
