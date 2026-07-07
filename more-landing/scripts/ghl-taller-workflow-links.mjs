/**
 * Imprime enlaces directos a los workflows del Taller en GHL + checklist de publicación.
 *
 * Uso: node scripts/ghl-taller-workflow-links.mjs
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  getGhlCrmBase,
  ghlWorkflowUrl,
  ghlWorkflowsListUrl,
  ghlEmailTemplatesUrl,
} from "./ghl-crm-url.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")

const WORKFLOWS = [
  {
    id: "9fa2be1f-391a-463e-a894-af8393c17375",
    name: "taller-julio-2026 — Bienvenida",
    steps: [
      "Trigger: Contact Tag → Tag added → taller-julio-2026",
      "Action: Send Email → TALLER-REDFLAGS-Bienvenida",
      "Settings → Allow re-entry: OFF",
      "Publish",
    ],
  },
  {
    id: "78e75337-6fd3-4cbf-876f-cfa62c371ca6",
    name: "taller-julio-2026 — Recordatorio",
    steps: [
      "Trigger: Contact Tag → Tag added → taller-julio-2026",
      "Wait → 12 jul 2026, 7:00 PM (America/Bogota)",
      "Send Email → TALLER-REDFLAGS-Recordatorio-24hs",
      "Wait → 13 jul 2026, 9:00 AM (America/Bogota)",
      "Send Email → TALLER-REDFLAGS-Hoy-Manana",
      "Wait → 13 jul 2026, 6:00 PM (America/Bogota)",
      "Send Email → TALLER-REDFLAGS-Hoy-1h",
      "Wait → 13 jul 2026, 7:00 PM (America/Bogota)",
      "Send Email → TALLER-REDFLAGS-EnVivo",
      "Settings → Allow re-entry: OFF",
      "Publish",
    ],
  },
]

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
const loc = env.GHL_LOCATION_ID
const crmBase = getGhlCrmBase(env)

console.log("=== Enlaces workflows Taller Red Flags ===\n")
console.log(`CRM: ${crmBase}`)
console.log(`Location: ${loc}`)
console.log(`Workflows: ${ghlWorkflowsListUrl(loc, env)}`)
console.log(`Plantillas email: ${ghlEmailTemplatesUrl(loc, env)}\n`)

for (const wf of WORKFLOWS) {
  const url = ghlWorkflowUrl(loc, wf.id, env)
  console.log(`📋 ${wf.name}`)
  console.log(`   ${url}\n`)
  console.log("   Pasos:")
  wf.steps.forEach((s, i) => console.log(`   ${i + 1}. ${s}`))
  console.log("")
}

console.log("Tras publicar ambos:")
console.log("  node scripts/verify-ghl-taller-workflow.mjs")
console.log("  node scripts/enroll-ghl-taller-workflow.mjs ro9nPtkjArCFqioWG28J")
