/** Últimos emails de un contacto en GHL */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contactId = process.argv[2] ?? "ro9nPtkjArCFqioWG28J"

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env")
  const env = {}
  for (const rawLine of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    const eq = line.indexOf("=")
    if (eq < 0) continue
    env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim().replace(/^"|"$/g, "")
  }
  return env
}

const env = loadEnv()
const headers = {
  Authorization: `Bearer ${env.GHL_API_KEY}`,
  Version: "2021-07-28",
  Accept: "application/json",
}

const search = await fetch(
  `https://services.leadconnectorhq.com/conversations/search?locationId=${env.GHL_LOCATION_ID}&contactId=${contactId}&limit=5`,
  { headers }
)
const searchData = await search.json()
const convId = searchData.conversations?.[0]?.id
if (!convId) {
  console.log("Sin conversación para el contacto")
  process.exit(0)
}

const msgs = await fetch(
  `https://services.leadconnectorhq.com/conversations/${convId}/messages?limit=20`,
  { headers }
)
const msgData = await msgs.json()
const list = msgData.messages?.messages ?? msgData.messages ?? []
console.log(`Conversación: ${convId}`)
console.log(`Mensajes: ${Array.isArray(list) ? list.length : 0}\n`)
for (const m of Array.isArray(list) ? list : []) {
  console.log("---")
  console.log(`Tipo: ${m.messageType ?? m.type}`)
  console.log(`Fecha: ${m.dateAdded ?? m.createdAt}`)
  console.log(`Dir: ${m.direction} | Status: ${m.status}`)
  console.log(`Subject: ${m.meta?.email?.subject ?? m.subject ?? "(sin subject)"}`)
  const body = (m.body ?? m.message ?? "").slice(0, 200)
  console.log(`Preview: ${body}...`)
}
