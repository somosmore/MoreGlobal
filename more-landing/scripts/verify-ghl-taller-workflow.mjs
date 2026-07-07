/**
 * Verifica plantillas de email y workflows del Taller Red Flags en GHL.
 *
 * Uso (desde more-landing/):
 *   node scripts/verify-ghl-taller-workflow.mjs
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { getGhlCrmBase, ghlWorkflowUrl } from "./ghl-crm-url.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")

const REQUIRED_TEMPLATES = [
  "TALLER-REDFLAGS-Bienvenida",
  "TALLER-REDFLAGS-Recordatorio-24hs",
  "TALLER-REDFLAGS-Hoy-Manana",
  "TALLER-REDFLAGS-Hoy-1h",
  "TALLER-REDFLAGS-EnVivo",
]

const EXPECTED_WORKFLOWS = [
  {
    nameIncludes: "taller-julio-2026",
    nameIncludes2: "Bienvenida",
    id: "9fa2be1f-391a-463e-a894-af8393c17375",
    role: "Email inmediato al registrarse",
  },
  {
    nameIncludes: "taller-julio-2026",
    nameIncludes2: "Recordatorio",
    id: "78e75337-6fd3-4cbf-876f-cfa62c371ca6",
    role: "Waits + recordatorio 24h + email día del evento",
  },
]

const TRIGGER_TAG = "taller-julio-2026"

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

async function ghlGet(url) {
  const res = await fetch(url, { headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`${res.status} ${url}: ${JSON.stringify(data)}`)
  return data
}

function statusIcon(ok) {
  return ok ? "✅" : "❌"
}

async function main() {
  console.log("=== Verificación Taller Red Flags — GHL ===\n")
  console.log(`CRM: ${getGhlCrmBase(env)}\n`)

  const templates = await ghlGet(
    `https://services.leadconnectorhq.com/emails/builder?locationId=${encodeURIComponent(env.GHL_LOCATION_ID)}&limit=100`
  )
  const byName = new Map((templates.builders ?? []).map((t) => [t.name, t]))

  console.log("Plantillas de email:")
  let templatesOk = true
  for (const name of REQUIRED_TEMPLATES) {
    const tpl = byName.get(name)
    const ok = Boolean(tpl?.id)
    if (!ok) templatesOk = false
    console.log(`  ${statusIcon(ok)} ${name}${tpl?.id ? ` (${tpl.id})` : " — FALTA"}`)
  }

  const workflowsData = await ghlGet(
    `https://services.leadconnectorhq.com/workflows/?locationId=${encodeURIComponent(env.GHL_LOCATION_ID)}`
  )
  const workflows = workflowsData.workflows ?? []

  console.log("\nWorkflows:")
  let workflowsOk = true
  for (const expected of EXPECTED_WORKFLOWS) {
    const wf =
      workflows.find((w) => w.id === expected.id) ??
      workflows.find(
        (w) =>
          w.name?.toLowerCase().includes(expected.nameIncludes) &&
          w.name?.toLowerCase().includes(expected.nameIncludes2.toLowerCase())
      )
    if (!wf) {
      workflowsOk = false
      console.log(`  ❌ No encontrado: ${expected.nameIncludes} — ${expected.nameIncludes2}`)
      continue
    }
    const published = wf.status === "published"
    if (!published) workflowsOk = false
    console.log(
      `  ${statusIcon(published)} ${wf.name} [${wf.status}] — ${expected.role}`
    )
    console.log(`     ID: ${wf.id}`)
    console.log(`     URL: ${ghlWorkflowUrl(env.GHL_LOCATION_ID, wf.id, env)}`)
    if (!published) {
      console.log("     → Abrir URL arriba, verificar pasos y Publish")
    }
  }

  console.log("\nChecklist manual en GHL (no se puede hacer por API):")
  console.log(`  • Trigger en ambos workflows: Contact Tag → Tag added → ${TRIGGER_TAG}`)
  console.log("  • Workflow Bienvenida: Send Email → TALLER-REDFLAGS-Bienvenida")
  console.log("  • Workflow Recordatorio:")
  console.log("      1. Wait → 12 jul 2026, 7:00 PM (America/Bogota)")
  console.log("      2. Send Email → TALLER-REDFLAGS-Recordatorio-24hs")
  console.log("      3. Wait → 13 jul 2026, 9:00 AM (America/Bogota)")
  console.log("      4. Send Email → TALLER-REDFLAGS-Hoy-Manana")
  console.log("      5. Wait → 13 jul 2026, 6:00 PM (America/Bogota)")
  console.log("      6. Send Email → TALLER-REDFLAGS-Hoy-1h")
  console.log("      7. Wait → 13 jul 2026, 7:00 PM (America/Bogota)")
  console.log("      8. Send Email → TALLER-REDFLAGS-EnVivo")
  console.log("  • Allow re-entry: OFF en ambos")
  console.log("  • Publicar ambos workflows")

  console.log("\nPrueba tras publicar:")
  console.log("  node scripts/enroll-ghl-taller-workflow.mjs <contactId>")
  console.log("  (o registrar en /taller-niw con email real de prueba)")

  if (!templatesOk || !workflowsOk) {
    console.log("\n⚠ Hay pendientes. Ver Documentacion/taller-redflags-ghl-workflow.md")
    process.exit(1)
  }

  console.log("\n✅ Plantillas y workflows publicados — listo para prueba end-to-end")
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
