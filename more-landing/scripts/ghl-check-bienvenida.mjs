/** Dump metadata de workflows + estado de inscripción de un contacto */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const contactId = process.argv[2] ?? "ro9nPtkjArCFqioWG28J"
const bienvenidaId = "9fa2be1f-391a-463e-a894-af8393c17375"

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

async function ghl(url, opts = {}) {
  const res = await fetch(url, { headers, ...opts })
  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = text
  }
  return { status: res.status, data }
}

const workflows = await ghl(
  `https://services.leadconnectorhq.com/workflows/?locationId=${env.GHL_LOCATION_ID}`
)
const wf = workflows.data?.workflows?.find((w) => w.id === bienvenidaId)
console.log("=== Workflow Bienvenida (metadata API) ===\n")
console.log(JSON.stringify(wf, null, 2))

console.log("\n=== Contacto ===\n")
const contact = await ghl(`https://services.leadconnectorhq.com/contacts/${contactId}`)
console.log(JSON.stringify(contact.data?.contact ?? contact.data, null, 2))

const probeUrls = [
  `https://services.leadconnectorhq.com/contacts/${contactId}/workflow/${bienvenidaId}`,
  `https://services.leadconnectorhq.com/contacts/${contactId}/workflows`,
]
console.log("\n=== Inscripción workflow (probe) ===\n")
for (const url of probeUrls) {
  const get = await ghl(url)
  console.log(`GET ${url} → ${get.status}`)
  console.log(JSON.stringify(get.data, null, 2).slice(0, 2000))
}

const email = contact.data?.contact?.email
if (email) {
  const conv = await ghl(
    `https://services.leadconnectorhq.com/conversations/search?locationId=${env.GHL_LOCATION_ID}&contactId=${contactId}&limit=5`
  )
  console.log("\n=== Conversaciones del contacto ===\n")
  console.log(JSON.stringify(conv.data, null, 2).slice(0, 3000))
}
