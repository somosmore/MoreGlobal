/**
 * Envía email urgente de cupos a contactos con tag taller-julio-2026.
 *
 * Uso (desde more-landing/):
 *   node scripts/send-taller-cupos-email.mjs [--dry-run] [--limit=N] [--from=email@domínio.com] [--skip-test]
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, "..")

const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const skipTest = !args.includes("--include-test")
const limitArg = args.find((a) => a.startsWith("--limit="))
const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity
const fromArg = args.find((a) => a.startsWith("--from="))
const fromOverride = fromArg ? fromArg.split("=").slice(1).join("=") : null

function loadEnv() {
  const env = {}
  for (const rawLine of fs.readFileSync(path.join(PROJECT_ROOT, ".env"), "utf8").split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    const eq = line.indexOf("=")
    if (eq < 0) continue
    env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim().replace(/^"|"$/g, "")
  }
  return env
}

const env = loadEnv()
const GHL_API_KEY = env.GHL_API_KEY
const GHL_LOCATION_ID = env.GHL_LOCATION_ID
if (!GHL_API_KEY || !GHL_LOCATION_ID) {
  console.error("Faltan GHL_API_KEY o GHL_LOCATION_ID")
  process.exit(1)
}

const headers = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  Version: "2021-07-28",
  "Content-Type": "application/json",
  Accept: "application/json",
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const SUBJECT = "⚠️ Los cupos se están llenando — entra AHORA a la masterclass de HOY"
const ZOOM_URL = "https://us02web.zoom.us/meeting/register/z1tEaTnxTEKctLPQ1rEEtg"

const HTML = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12);">
          <tr>
            <td style="background:linear-gradient(180deg,#F37021 0%,#D4611A 100%);padding:36px 32px 28px;text-align:center;">
              <img src="https://moremigracion.com/logo_more_dark.png" alt="MORE" width="140" style="display:block;margin:0 auto 20px;" />
              <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;line-height:1.25;">
                ⚠️ Los cupos se están llenando
              </h1>
            </td>
          </tr>
          <tr>
            <td style="background-color:#ffffff;padding:32px;">
              <p style="margin:0 0 16px;font-size:16px;color:#1a2340;line-height:1.6;font-weight:600;">
                Este es el link de acceso para la masterclass de <strong>HOY</strong>.
              </p>
              <p style="margin:0 0 20px;font-size:15px;color:#333333;line-height:1.6;">
                Una vez que la sala se llene <strong>no hay más entradas</strong>.
              </p>
              <p style="margin:0 0 8px;font-size:16px;color:#1a2340;line-height:1.5;font-weight:700;">
                Red flags de los abogados de inmigración: te lo confiesa una abogada
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#555555;line-height:1.5;">
                🗓️ Hoy · 7PM Colombia · En vivo · Sin replay
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td align="center">
                    <a href="${ZOOM_URL}" target="_blank" style="display:inline-block;padding:18px 44px;background:linear-gradient(135deg,#F37021,#D4611A);color:#ffffff;font-size:17px;font-weight:800;text-decoration:none;border-radius:8px;box-shadow:0 6px 20px rgba(243,112,33,0.45);">
                      Entra AHORA y asegura tu lugar
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:13px;color:#777;text-align:center;word-break:break-all;">
                🔗 <a href="${ZOOM_URL}" style="color:#F37021;">${ZOOM_URL}</a>
              </p>
              <p style="margin:20px 0 0;font-size:15px;color:#1a2340;text-align:center;">
                ¡Te esperamos! 💙
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#001A52;padding:24px 32px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;color:rgba(255,255,255,0.5);">MORE — Migración con Propósito</p>
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.3);">© 2026 MORE. Todos los derechos reservados.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

const PLAIN = `⚠️ Los cupos se están llenando.

Este es el link de acceso para la masterclass de HOY.

Una vez que la sala se llene no hay más entradas.

Red flags de los abogados de inmigración: te lo confiesa una abogada

🗓️ Hoy · 7PM Colombia · En vivo · Sin replay

Entra AHORA y asegura tu lugar 👇

🔗 ${ZOOM_URL}

¡Te esperamos! 💙`

async function ghlFetch(url, options = {}, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(url, {
      ...options,
      headers: { ...headers, ...(options.headers || {}) },
    })
    if (res.status === 429 || res.status >= 500) {
      await sleep(1200 * (attempt + 1))
      continue
    }
    return res
  }
  throw new Error(`GHL request failed after retries: ${url}`)
}

async function resolveFromEmail() {
  if (fromOverride) return fromOverride
  if (env.GHL_EMAIL_FROM) return env.GHL_EMAIL_FROM

  const res = await ghlFetch(
    `https://services.leadconnectorhq.com/locations/${GHL_LOCATION_ID}`
  )
  const data = await res.json()
  const loc = data?.location || data
  const candidates = [
    loc?.email,
    loc?.companyEmail,
    loc?.settings?.email,
    loc?.settings?.emailFrom,
  ].filter(Boolean)

  // Fallback conocido de la marca si la API no trae email
  candidates.push("hola@moremigracion.com", "ivon@moremigracion.com")

  for (const email of candidates) {
    if (typeof email === "string" && email.includes("@")) return email
  }
  return null
}

async function fetchTaggedContacts() {
  const all = []
  let page = 1
  let searchAfter
  while (true) {
    const body = {
      locationId: GHL_LOCATION_ID,
      pageLimit: 100,
      page,
      filters: [
        {
          group: "AND",
          filters: [{ field: "tags", operator: "eq", value: "taller-julio-2026" }],
        },
      ],
    }
    if (searchAfter) body.searchAfter = searchAfter
    const res = await ghlFetch("https://services.leadconnectorhq.com/contacts/search", {
      method: "POST",
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(`Search failed: ${JSON.stringify(data)}`)
    const contacts = data.contacts || []
    all.push(...contacts)
    if (contacts.length === 0 || all.length >= (data.total || 0)) break
    const last = contacts[contacts.length - 1]
    searchAfter = last?.searchAfter || [last?.id, last?.dateAdded].filter(Boolean)
    page++
    if (page > 20) break
  }
  return all
}

async function sendEmail({ contactId, emailTo, emailFrom }) {
  const payload = {
    type: "Email",
    contactId,
    emailFrom,
    emailTo,
    subject: SUBJECT,
    html: HTML,
    message: PLAIN,
  }
  const res = await ghlFetch("https://services.leadconnectorhq.com/conversations/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    data = text
  }
  return { ok: res.ok, status: res.status, data }
}

function isTestContact(c) {
  const email = (c.email || "").toLowerCase()
  const name = (c.contactName || c.name || "").toLowerCase()
  return (
    email.includes("more-test.invalid") ||
    email.includes("test.cursor") ||
    name.includes("test cursor")
  )
}

async function main() {
  const emailFrom = await resolveFromEmail()
  if (!emailFrom) {
    console.error("No se pudo resolver emailFrom. Pasá --from=tu@dominio.com")
    process.exit(1)
  }

  const contacts = await fetchTaggedContacts()
  let targets = contacts.filter((c) => c.email && c.email.includes("@"))
  if (skipTest) targets = targets.filter((c) => !isTestContact(c))
  targets = targets.slice(0, limit)

  console.log(`From: ${emailFrom}`)
  console.log(`Contactos tag taller-julio-2026: ${contacts.length}`)
  console.log(`A enviar: ${targets.length}`)
  console.log(`Modo: ${dryRun ? "DRY-RUN" : "LIVE"}`)
  console.log(`Asunto: ${SUBJECT}`)
  console.log("")

  const report = {
    total: 0,
    sent: 0,
    failed: 0,
    skipped: 0,
    emailFrom,
    rows: [],
  }

  for (let i = 0; i < targets.length; i++) {
    const c = targets[i]
    report.total++
    const label = `[${i + 1}/${targets.length}] ${c.email}`

    if (dryRun) {
      console.log(`${label} -> [DRY] would_send`)
      report.sent++
      report.rows.push({ email: c.email, id: c.id, result: "would_send" })
      continue
    }

    try {
      const r = await sendEmail({
        contactId: c.id,
        emailTo: c.email,
        emailFrom,
      })
      if (r.ok) {
        console.log(`${label} -> ENVIADO`)
        report.sent++
        report.rows.push({ email: c.email, id: c.id, result: "sent" })
      } else {
        console.log(`${label} -> FAIL (${r.status}) ${JSON.stringify(r.data).slice(0, 300)}`)
        report.failed++
        report.rows.push({
          email: c.email,
          id: c.id,
          result: "failed",
          error: r.data,
        })
      }
    } catch (err) {
      console.log(`${label} -> ERROR ${err.message}`)
      report.failed++
      report.rows.push({ email: c.email, id: c.id, result: "error", error: err.message })
    }

    await sleep(350)
  }

  const outDir = path.join(PROJECT_ROOT, "scripts", "reports")
  fs.mkdirSync(outDir, { recursive: true })
  const ts = new Date().toISOString().replace(/[:.]/g, "-")
  const reportPath = path.join(outDir, `send-cupos-taller-${ts}.json`)
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8")

  console.log("")
  console.log("===== RESUMEN =====")
  console.log(`Enviados:  ${report.sent}`)
  console.log(`Fallidos:  ${report.failed}`)
  console.log(`From:      ${report.emailFrom}`)
  console.log(`Reporte:   ${reportPath}`)
}

main().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
