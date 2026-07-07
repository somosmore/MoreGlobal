/**
 * Crea el pipeline "Taller Red Flags — Julio 2026" en GoHighLevel.
 *
 * Requiere GHL_API_KEY con scope de escritura de pipelines/opportunities
 * (Private Integration → scopes: opportunities.write o equivalente).
 *
 * Uso (desde more-landing/):
 *   node scripts/create-ghl-taller-pipeline.mjs [--dry-run]
 *
 * Si el token no tiene permiso, el script imprime instrucciones para crearlo
 * manualmente en GHL y los IDs que debes copiar a secrets.
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")
const dryRun = process.argv.includes("--dry-run")

const PIPELINE_NAME = "Taller Red Flags — Julio 2026"

const STAGES = [
  "Nuevo Registro",
  "Confirmado",
  "Engaged Pre-Evento",
  "Asistio en Vivo",
  "No Asistio",
  "Interesado (Hand Raiser)",
  "Consulta Agendada",
  "No Interesado / Perdido",
]

function loadEnv() {
  const envPath = path.join(PROJECT_ROOT, ".env")
  if (!fs.existsSync(envPath)) {
    console.error("No se encontró .env en more-landing/")
    process.exit(1)
  }
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

async function listPipelines() {
  const res = await fetch(
    `https://services.leadconnectorhq.com/opportunities/pipelines?locationId=${encodeURIComponent(GHL_LOCATION_ID)}`,
    { headers }
  )
  const data = await res.json()
  if (!res.ok) throw new Error(`GET pipelines failed: ${JSON.stringify(data)}`)
  return data.pipelines ?? []
}

async function createPipeline() {
  const body = {
    locationId: GHL_LOCATION_ID,
    name: PIPELINE_NAME,
    showInFunnel: true,
    showInPieChart: true,
    stages: STAGES.map((name, position) => ({ name, position })),
  }

  if (dryRun) {
    console.log("=== DRY RUN — payload ===")
    console.log(JSON.stringify(body, null, 2))
    return null
  }

  const res = await fetch(
    "https://services.leadconnectorhq.com/opportunities/pipelines",
    { method: "POST", headers, body: JSON.stringify(body) }
  )
  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = { raw: text }
  }

  if (!res.ok) {
    const err = new Error(`POST pipeline failed (${res.status}): ${text}`)
    err.status = res.status
    err.data = data
    throw err
  }

  return data.pipeline ?? data
}

function printSecrets(pipelineId, stageId) {
  console.log("\n--- Copiar a Supabase secrets ---\n")
  console.log(`npx supabase secrets set GHL_TALLER_PIPELINE_ID=${pipelineId}`)
  console.log(`npx supabase secrets set GHL_TALLER_STAGE_ID=${stageId}`)
  console.log(`npx supabase secrets set GHL_TALLER_TAG=Taller-julio-2026`)
  console.log("\n--- Opcional: more-landing/.env local ---\n")
  console.log(`GHL_TALLER_PIPELINE_ID=${pipelineId}`)
  console.log(`GHL_TALLER_STAGE_ID=${stageId}`)
  console.log(`GHL_TALLER_TAG=Taller-julio-2026`)
}

function printManualInstructions() {
  console.log(`
El token actual no puede crear pipelines (falta scope en Private Integration).

Opción A — Ampliar permisos del token
  1. GHL → Settings → Private Integrations → tu integración
  2. Activar scope de escritura de Opportunities / Pipelines
  3. Regenerar token y actualizar GHL_API_KEY en .env y Supabase secrets
  4. Volver a ejecutar: node scripts/create-ghl-taller-pipeline.mjs

Opción B — Crear manualmente en GHL
  1. Opportunities → Pipelines → + Create Pipeline
  2. Nombre: "${PIPELINE_NAME}"
  3. Etapas (en orden):
${STAGES.map((s, i) => `     ${i + 1}. ${s}`).join("\n")}
  4. Guardar y copiar Pipeline ID + ID de etapa "Nuevo Registro"
  5. Ejecutar secrets con los IDs (ver formato arriba)
`)
}

async function main() {
  console.log(dryRun ? "=== DRY RUN ===" : "=== Crear pipeline Taller Red Flags ===\n")

  const existing = await listPipelines()
  const found = existing.find(
    (p) => p.name?.toLowerCase() === PIPELINE_NAME.toLowerCase()
  )

  if (found) {
    const nuevoRegistro = found.stages?.find(
      (s) => s.name?.toLowerCase() === "nuevo registro"
    )
    console.log(`✅ Pipeline ya existe: "${found.name}"`)
    console.log(`   Pipeline ID: ${found.id}`)
    if (nuevoRegistro) {
      console.log(`   Stage "Nuevo Registro": ${nuevoRegistro.id}`)
      printSecrets(found.id, nuevoRegistro.id)
    } else {
      console.log("   ⚠ No se encontró etapa 'Nuevo Registro'. Revisa stages en GHL.")
      console.log("   Stages:", found.stages?.map((s) => s.name).join(", "))
    }
    return
  }

  console.log(`Pipeline "${PIPELINE_NAME}" no existe. Creando...\n`)

  try {
    const created = await createPipeline()
    if (dryRun) return

    const pipelineId = created?.id
    const nuevoRegistro = created?.stages?.find(
      (s) => s.name?.toLowerCase() === "nuevo registro"
    )

    if (!pipelineId) {
      console.log("Respuesta inesperada:", JSON.stringify(created, null, 2))
      return
    }

    console.log(`✅ Pipeline creado: ${pipelineId}`)
    if (nuevoRegistro) {
      console.log(`   Stage "Nuevo Registro": ${nuevoRegistro.id}`)
      printSecrets(pipelineId, nuevoRegistro.id)
    }
  } catch (err) {
    if (err.status === 401) {
      printManualInstructions()
      process.exit(1)
    }
    throw err
  }
}

main().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})
