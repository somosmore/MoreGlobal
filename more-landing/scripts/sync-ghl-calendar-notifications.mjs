/**
 * Sincroniza plantillas y notificaciones de calendario de MORE con GHL.
 *
 * Uso desde more-landing/:
 *   node scripts/sync-ghl-calendar-notifications.mjs --dry-run
 *   node scripts/sync-ghl-calendar-notifications.mjs --apply --all-calendars
 *   node scripts/sync-ghl-calendar-notifications.mjs --apply --calendar-id ID --prune
 *   node scripts/sync-ghl-calendar-notifications.mjs --verify --all-calendars
 *
 * --apply es obligatorio para crear o actualizar recursos en GHL.
 * El script nunca registra el token ni datos de contactos.
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")
const MANIFEST_PATH = path.join(PROJECT_ROOT, "public", "calendar-notifications.json")
const EMAIL_API_VERSION = "2021-07-28"
const CALENDAR_API_VERSION = "2021-04-15"
const dryRun = !process.argv.includes("--apply")
const verifyOnly = process.argv.includes("--verify")
const prune = process.argv.includes("--prune")
const calendarIdArg = valueAfter("--calendar-id")

function valueAfter(flag) {
  const index = process.argv.indexOf(flag)
  return index >= 0 ? process.argv[index + 1] : null
}

function loadEnv() {
  const envPath = path.join(PROJECT_ROOT, ".env")
  if (!fs.existsSync(envPath)) throw new Error("No se encontró more-landing/.env")
  const env = {}
  for (const rawLine of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    const separator = line.indexOf("=")
    if (separator < 0) continue
    const key = line.slice(0, separator).trim()
    let value = line.slice(separator + 1).trim()
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    env[key] = value
  }
  return env
}

const env = loadEnv()
const apiKey = env.GHL_API_KEY
const locationId = env.GHL_LOCATION_ID
if (!apiKey || !locationId) throw new Error("Faltan GHL_API_KEY o GHL_LOCATION_ID en .env")

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"))
const allowedChannels = new Set(["email", "sms", "whatsapp"])
const allowedNotificationTypes = new Set(["booked", "confirmation", "cancellation", "reschedule", "reminder", "followup"])

const LEGACY_EMAIL_NAMES = {
  "booked-confirmed": ["Confirmación Agenda", "Confirmacion Agenda", "Confirmación de Agenda"],
  "reminder-24h": ["Recordatorio 24h", "Recordatorio Agenda 24h", "Recordatorio de Agenda 24h"],
  "reminder-1h": ["Recordatorio 1h", "Recordatorio Agenda 1h", "Recordatorio de Agenda 1h"],
}

function validateManifest() {
  if (manifest.version !== 1 || manifest.locale !== "es") throw new Error("Manifest de calendario incompatible")
  if (manifest.channels.some((channel) => !allowedChannels.has(channel))) throw new Error("Canal no soportado en el manifest")
  const ids = new Set()
  for (const event of manifest.events) {
    if (ids.has(event.id)) throw new Error(`Evento duplicado: ${event.id}`)
    ids.add(event.id)
    if (!allowedNotificationTypes.has(event.notificationType)) throw new Error(`Tipo GHL inválido: ${event.notificationType}`)
    if (!event.subject || !event.sms || !event.whatsapp) throw new Error(`Contenido incompleto: ${event.id}`)
    if (event.sms.length > 320) throw new Error(`SMS excede 320 caracteres: ${event.id}`)
    for (const field of [event.ctaField, event.secondaryField]) {
      if (field && !/^\{\{[a-z0-9_.]+\}\}$/.test(field)) throw new Error(`Merge field inválido: ${field}`)
    }
  }
}

const headers = {
  Authorization: `Bearer ${apiKey}`,
  Accept: "application/json",
  "Content-Type": "application/json",
}

async function ghlFetch(url, options = {}, version = CALENDAR_API_VERSION) {
  let lastError
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20000)
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: { ...headers, Version: version, ...(options.headers || {}) },
      })
      const raw = await response.text()
      const data = raw ? JSON.parse(raw) : {}
      if (response.ok) return data
      if (![429, 500, 502, 503, 504].includes(response.status)) {
        throw new Error(`${response.status} ${url}: ${JSON.stringify(data)}`)
      }
      lastError = new Error(`${response.status} ${url}`)
    } catch (error) {
      lastError = error
    } finally {
      clearTimeout(timeout)
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
  }
  throw lastError
}

async function listCalendars() {
  const data = await ghlFetch(
    `https://services.leadconnectorhq.com/calendars/?locationId=${encodeURIComponent(locationId)}`
  )
  const list = data.calendars ?? data.data ?? data
  if (Array.isArray(list)) return list
  return list?.calendars ?? []
}

async function listEmailTemplates() {
  const data = await ghlFetch(
    `https://services.leadconnectorhq.com/emails/builder?locationId=${encodeURIComponent(locationId)}&limit=100`,
    {},
    EMAIL_API_VERSION
  )
  return data.builders ?? data.data ?? []
}

async function listNotifications(calendarId) {
  const data = await ghlFetch(`https://services.leadconnectorhq.com/calendars/${encodeURIComponent(calendarId)}/notifications?limit=200`)
  return Array.isArray(data) ? data : data.notifications ?? data.data ?? []
}

function renderEmail(event) {
  const action = event.ctaField
    ? `<p style="margin:24px 0;text-align:center"><a href="${event.ctaField}" style="display:inline-block;background:#F37021;color:#fff;padding:13px 24px;border-radius:8px;text-decoration:none;font-weight:700">${event.ctaLabel}</a></p>`
    : ""
  const secondary = event.secondaryField
    ? `<p style="font-size:13px;text-align:center"><a href="${event.secondaryField}" style="color:#0033A0">${event.secondaryLabel}</a></p>`
    : ""
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${event.subject}</title></head><body style="margin:0;background:#f5f6f8;font-family:Arial,sans-serif;color:#1a2340"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="600" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden"><tr><td style="background:#001A52;padding:32px;text-align:center;color:#fff"><div style="color:#F37021;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">${event.badge}</div><h1 style="margin:12px 0 0;font-size:26px;line-height:1.2">${event.headline}</h1></td></tr><tr><td style="padding:32px"><p>Hola <strong>{{contact.first_name}}</strong> 👋</p><p>${event.intro}</p><table role="presentation" width="100%" style="background:#001A52;color:#fff;border-radius:12px;margin:24px 0"><tr><td style="padding:20px"><p style="margin:0 0 8px"><strong>{{appointment.title}}</strong></p><p style="margin:0 0 5px">📅 {{appointment.only_start_date}}</p><p style="margin:0 0 5px">🕐 {{appointment.only_start_time}} — {{appointment.only_end_time}} ({{appointment.timezone}})</p><p style="margin:0">📍 {{appointment.meeting_location}}</p></td></tr></table><p>${event.body}</p>${action}${secondary}<p style="color:#777;font-size:13px;text-align:center;margin-top:28px">MORE — Migración con Propósito</p></td></tr></table></td></tr></table></body></html>`
}

function emailName(event) {
  return `MORE-CALENDAR-${event.id}-EMAIL`
}

function notificationKey(notification) {
  const before = JSON.stringify(notification.beforeTime ?? [])
  const after = JSON.stringify(notification.afterTime ?? [])
  return [notification.channel, notification.notificationType, before, after].join("|")
}

function desiredNotifications(event, emailTemplateId) {
  return manifest.channels.map((channel) => ({
    receiverType: "contact",
    channel,
    notificationType: event.notificationType,
    isActive: true,
    subject: channel === "email" ? event.subject : undefined,
    body: channel === "email" ? renderEmail(event) : event[channel],
    templateId: channel === "email" ? emailTemplateId : undefined,
    beforeTime: event.beforeTime ?? [],
    afterTime: event.afterTime ?? [],
  }))
}

async function syncEmailTemplates(existingTemplates) {
  const byName = new Map(existingTemplates.map((template) => [template.name, template]))
  const ids = new Map()
  for (const event of manifest.events) {
    const name = emailName(event)
    const existing = byName.get(name)
    if (dryRun || verifyOnly) {
      for (const legacyName of LEGACY_EMAIL_NAMES[event.id] ?? []) {
        const legacy = byName.get(legacyName)
        if (legacy?.id && legacy.id !== existing?.id) {
          console.log(`Legacy ${legacyName} -> ${name} (${legacy.id})`)
        }
      }
    }
    if (dryRun || verifyOnly) {
      ids.set(event.id, existing?.id ?? null)
      console.log(`${existing ? "↻" : "＋"} Email ${name}${existing ? ` (${existing.id})` : ""}`)
      continue
    }
    let id = existing?.id
    if (!id) {
      const created = await ghlFetch("https://services.leadconnectorhq.com/emails/builder", {
        method: "POST",
        body: JSON.stringify({ locationId, name, type: "html", builderVersion: "2" }),
      }, EMAIL_API_VERSION)
      id = created?.id ?? created?.builder?.id ?? created?.data?.id
    }
    if (!id) throw new Error(`GHL no devolvió ID para ${name}`)
    await ghlFetch(`https://services.leadconnectorhq.com/emails/builder/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        locationId,
        name,
        editorType: "html",
        editorContent: renderEmail(event),
        subjectLine: event.subject,
        previewText: event.intro,
        fromName: env.GHL_EMAIL_FROM_NAME || "MORE — Migración con Propósito",
      }),
    }, EMAIL_API_VERSION)
    ids.set(event.id, id)
    console.log(`✓ Email sincronizado ${name} (${id})`)

    for (const legacyName of LEGACY_EMAIL_NAMES[event.id] ?? []) {
      const legacy = byName.get(legacyName)
      if (!legacy?.id || legacy.id === id) continue
      if (dryRun || verifyOnly) {
        console.log(`↻ Legacy ${legacyName} → ${name} (${legacy.id})`)
        continue
      }
      await ghlFetch(`https://services.leadconnectorhq.com/emails/builder/${legacy.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          locationId,
          name: legacyName,
          editorType: "html",
          editorContent: renderEmail(event),
          subjectLine: event.subject,
          previewText: event.intro,
          fromName: env.GHL_EMAIL_FROM_NAME || "MORE — Migración con Propósito",
        }),
      }, EMAIL_API_VERSION)
      console.log(`✓ Legacy actualizado ${legacyName} (${legacy.id})`)
    }
  }
  return ids
}

async function syncCalendar(calendar, emailIds) {
  const existing = await listNotifications(calendar.id)
  const existingByKey = new Map()
  for (const notification of existing) {
    const key = notificationKey(notification)
    const list = existingByKey.get(key) ?? []
    list.push(notification)
    existingByKey.set(key, list)
  }
  for (const event of manifest.events) {
    const desired = desiredNotifications(event, emailIds.get(event.id))
    for (const payload of desired) {
      const key = notificationKey(payload)
      const matches = existingByKey.get(key) ?? []
      const current = matches.shift()
      const method = current ? "PUT" : "POST"
      const url = current
        ? `https://services.leadconnectorhq.com/calendars/${encodeURIComponent(calendar.id)}/notifications/${encodeURIComponent(current._id || current.id)}`
        : `https://services.leadconnectorhq.com/calendars/${encodeURIComponent(calendar.id)}/notifications`
      const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined))
      if (dryRun || verifyOnly) {
        console.log(`${current ? "↻" : "＋"} ${calendar.name}: ${payload.channel}/${event.id}`)
        continue
      }
      await ghlFetch(url, { method, body: JSON.stringify(current ? cleanPayload : [cleanPayload]) })
      console.log(`✓ ${calendar.name}: ${payload.channel}/${event.id}`)
    }
  }
  const duplicates = [...existingByKey.values()].flat()
  if (duplicates.length) {
    console.warn(`⚠ ${calendar.name}: ${duplicates.length} notificaciones sobrantes detectadas`)
    if (prune && !dryRun && !verifyOnly) {
      for (const notification of duplicates) {
        const id = notification._id || notification.id
        await ghlFetch(`https://services.leadconnectorhq.com/calendars/${encodeURIComponent(calendar.id)}/notifications/${encodeURIComponent(id)}`, { method: "DELETE" })
        console.log(`✓ Eliminada notificación sobrante ${id}`)
      }
    }
  }
}

async function main() {
  validateManifest()
  console.log(dryRun ? "=== DRY RUN: no se modificará GHL ===" : verifyOnly ? "=== VERIFY: solo lectura ===" : "=== APPLY: sincronizando GHL ===")
  const calendars = await listCalendars()
  const selected = calendarIdArg ? calendars.filter((calendar) => calendar.id === calendarIdArg) : calendars
  if (!selected.length) throw new Error(calendarIdArg ? `No se encontró el calendario ${calendarIdArg}` : "GHL no devolvió calendarios")
  console.log(`Calendarios seleccionados: ${selected.length}`)
  const emailTemplates = await listEmailTemplates()
  const emailIds = await syncEmailTemplates(emailTemplates)
  for (const calendar of selected) await syncCalendar(calendar, emailIds)
  console.log(`\n✓ Matriz procesada: ${manifest.events.length} eventos × ${manifest.channels.length} canales × ${selected.length} calendarios`)
  if (dryRun) console.log("Para aplicar: node scripts/sync-ghl-calendar-notifications.mjs --apply --all-calendars")
}

main().catch((error) => {
  console.error(`✗ ${error.message || error}`)
  process.exitCode = 1
})
