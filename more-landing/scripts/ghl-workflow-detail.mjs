/**
 * Detalle de un workflow GHL por ID (solo lectura).
 * Uso: node scripts/ghl-workflow-detail.mjs <workflowId>
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const workflowId = process.argv[2] ?? "9fa2be1f-391a-463e-a894-af8393c17375"

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

const urls = [
  `https://services.leadconnectorhq.com/workflows/${workflowId}?locationId=${env.GHL_LOCATION_ID}`,
  `https://services.leadconnectorhq.com/workflows/${workflowId}`,
]

for (const url of urls) {
  const res = await fetch(url, { headers })
  const text = await res.text()
  console.log(`\n--- ${url}`)
  console.log(`Status: ${res.status}`)
  try {
    console.log(JSON.stringify(JSON.parse(text), null, 2))
  } catch {
    console.log(text.slice(0, 3000))
  }
}
