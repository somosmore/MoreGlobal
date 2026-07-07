/**
 * Inscribe un contacto en los workflows del Taller Red Flags (pruebas).
 *
 * Uso (desde more-landing/):
 *   node scripts/enroll-ghl-taller-workflow.mjs <contactId> [--dry-run]
 *
 * Ejemplo (contacto de prueba Cursor):
 *   node scripts/enroll-ghl-taller-workflow.mjs ro9nPtkjArCFqioWG28J
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")

const WORKFLOWS = [
  { id: "9fa2be1f-391a-463e-a894-af8393c17375", name: "taller-julio-2026 — Bienvenida" },
  { id: "78e75337-6fd3-4cbf-876f-cfa62c371ca6", name: "taller-julio-2026 — Recordatorio" },
]

const contactId = process.argv[2]
const dryRun = process.argv.includes("--dry-run")

if (!contactId || contactId.startsWith("--")) {
  console.error("Uso: node scripts/enroll-ghl-taller-workflow.mjs <contactId> [--dry-run]")
  process.exit(1)
}

function loadEnv() {
  const envPath = path.join(PROJECT_ROOT, ".env")
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

async function enroll(workflowId, workflowName) {
  const url = `https://services.leadconnectorhq.com/contacts/${contactId}/workflow/${workflowId}`
  if (dryRun) {
    console.log(`• [dry-run] POST ${workflowName}`)
    return
  }
  const res = await fetch(url, { method: "POST", headers })
  const text = await res.text()
  if (!res.ok) throw new Error(`${workflowName}: ${res.status} ${text}`)
  console.log(`✅ Inscrito en: ${workflowName}`)
}

async function main() {
  console.log(dryRun ? "=== DRY RUN ===" : "=== Enroll Taller workflows ===")
  console.log(`Contacto: ${contactId}\n`)

  for (const wf of WORKFLOWS) {
    await enroll(wf.id, wf.name)
  }

  if (!dryRun) {
    console.log("\nRevisa en GHL → Automation → Workflow history del contacto.")
    console.log("Nota: los workflows deben estar PUBLICADOS para ejecutar acciones.")
  }
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
