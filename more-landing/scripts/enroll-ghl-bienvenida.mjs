/** Inscribe contacto solo en workflow Bienvenida */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const contactId = process.argv[2]
const workflowId = "9fa2be1f-391a-463e-a894-af8393c17375"
if (!contactId) {
  console.error("Uso: node scripts/enroll-ghl-bienvenida.mjs <contactId>")
  process.exit(1)
}

const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env")
const env = {}
for (const rawLine of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const line = rawLine.trim()
  if (!line || line.startsWith("#")) continue
  const eq = line.indexOf("=")
  if (eq < 0) continue
  env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim().replace(/^"|"$/g, "")
}

const res = await fetch(
  `https://services.leadconnectorhq.com/contacts/${contactId}/workflow/${workflowId}`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GHL_API_KEY}`,
      Version: "2021-07-28",
      Accept: "application/json",
    },
  }
)
const text = await res.text()
console.log(`Status: ${res.status}`)
console.log(text)
