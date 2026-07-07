/**
 * Sube/actualiza plantillas HTML del Taller Red Flags en GoHighLevel.
 *
 * Uso (desde more-landing/):
 *   node scripts/sync-ghl-taller-emails.mjs [--dry-run]
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")
const EMAILS_DIR = path.join(PROJECT_ROOT, "public", "emails")

const dryRun = process.argv.includes("--dry-run")

const TEMPLATES = [
  {
    name: "TALLER-REDFLAGS-Bienvenida",
    file: "bienvenida-taller-redflags.html",
    subject: "¡Tu lugar está reservado! — Taller Red Flags",
    previewText: "Confirma tu registro y reserva tu cupo en Zoom para el 13 de julio.",
  },
  {
    name: "TALLER-REDFLAGS-Recordatorio-24hs",
    file: "previo-taller-redflags.html",
    subject: "¡Mañana es el taller! — Red flags de abogados",
    previewText: "Falta 1 día para el taller gratuito con Ivon More.",
  },
  {
    name: "TALLER-REDFLAGS-Hoy-Manana",
    file: "recordatorio-taller-redflags-manana.html",
    subject: "¡Hoy es el taller! — Red flags de abogados",
    previewText: "Esta noche a las 7 PM (Colombia). Confirma tu cupo en Zoom.",
  },
  {
    name: "TALLER-REDFLAGS-Hoy-1h",
    file: "recordatorio-taller-redflags-1h.html",
    subject: "¡En 1 hora empezamos! — Taller Red Flags",
    previewText: "El taller con Ivon More arranca a las 7 PM. Ten listo tu link de Zoom.",
  },
  {
    name: "TALLER-REDFLAGS-EnVivo",
    file: "recordatorio-taller-redflags.html",
    subject: "🔴 ¡ESTAMOS EN VIVO! — Entra al taller ahora",
    previewText: "El taller Red Flags ya comenzó. Entra a Zoom ahora mismo.",
  },
]

function loadEnv() {
  const envPath = path.join(PROJECT_ROOT, ".env")
  if (!fs.existsSync(envPath)) {
    console.error("No se encontró .env en more-landing/")
    process.exit(1)
  }
  const env = {}
  for (const rawLine of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    const eq = line.indexOf("=")
    if (eq < 0) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    env[key] = value
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

const ghlHeaders = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  Version: "2021-07-28",
  "Content-Type": "application/json",
  Accept: "application/json",
}

async function ghlFetch(url, options = {}) {
  const res = await fetch(url, { ...options, headers: { ...ghlHeaders, ...options.headers } })
  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { raw: text }
  }
  if (!res.ok) {
    throw new Error(`${res.status} ${url}: ${JSON.stringify(data)}`)
  }
  return data
}

async function listTemplates() {
  const data = await ghlFetch(
    `https://services.leadconnectorhq.com/emails/builder?locationId=${encodeURIComponent(GHL_LOCATION_ID)}&limit=100`
  )
  return data.builders ?? []
}

async function createTemplate(name) {
  const created = await ghlFetch("https://services.leadconnectorhq.com/emails/builder", {
    method: "POST",
    body: JSON.stringify({
      locationId: GHL_LOCATION_ID,
      name,
      type: "html",
      builderVersion: "2",
    }),
  })
  return created?.id ?? created?.builder?.id ?? created?.data?.id
}

async function updateTemplate(templateId, { name, html, subject, previewText }) {
  return ghlFetch(`https://services.leadconnectorhq.com/emails/builder/${templateId}`, {
    method: "PATCH",
    body: JSON.stringify({
      locationId: GHL_LOCATION_ID,
      name,
      editorType: "html",
      editorContent: html,
      subjectLine: subject,
      previewText,
      fromName: "MORE — Migración con Propósito",
    }),
  })
}

async function main() {
  console.log(dryRun ? "=== DRY RUN ===" : "=== Sync GHL Taller Red Flags emails ===")

  const existing = await listTemplates()
  const byName = new Map(existing.map((t) => [t.name, t]))

  for (const tpl of TEMPLATES) {
    const htmlPath = path.join(EMAILS_DIR, tpl.file)
    if (!fs.existsSync(htmlPath)) {
      console.error(`❌ Falta archivo: ${tpl.file}`)
      continue
    }
    const html = fs.readFileSync(htmlPath, "utf8")
    const found = byName.get(tpl.name)

    if (dryRun) {
      console.log(`• ${tpl.name} → ${found ? `actualizar (${found.id})` : "crear"}`)
      continue
    }

    try {
      let templateId = found?.id
      if (!templateId) {
        templateId = await createTemplate(tpl.name)
        console.log(`✅ Creada: ${tpl.name} (${templateId})`)
      } else {
        console.log(`↻ Actualizando: ${tpl.name} (${templateId})`)
      }

      if (!templateId) {
        throw new Error("No se obtuvo templateId al crear plantilla")
      }

      await updateTemplate(templateId, {
        name: tpl.name,
        html,
        subject: tpl.subject,
        previewText: tpl.previewText,
      })
      console.log(`   HTML + asunto aplicados`)
      await new Promise((r) => setTimeout(r, 400))
    } catch (err) {
      console.error(`❌ ${tpl.name}:`, err.message)
    }
  }

  console.log("\nPlantillas listas en GHL. Siguiente paso: workflow (ver Documentacion/taller-redflags-ghl-workflow.md)")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
