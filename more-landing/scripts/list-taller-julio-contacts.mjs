import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(__dirname, "..", ".env")
const env = {}
for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const t = line.trim()
  if (!t || t.startsWith("#") || !t.includes("=")) continue
  const i = t.indexOf("=")
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "")
}

const headers = {
  Authorization: `Bearer ${env.GHL_API_KEY}`,
  Version: "2021-07-28",
  "Content-Type": "application/json",
  Accept: "application/json",
}

const all = []
let page = 1
let searchAfter

while (true) {
  const body = {
    locationId: env.GHL_LOCATION_ID,
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

  const res = await fetch("https://services.leadconnectorhq.com/contacts/search", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) {
    console.error(JSON.stringify(data, null, 2))
    process.exit(1)
  }

  const contacts = data.contacts || []
  all.push(...contacts)

  if (contacts.length === 0 || all.length >= (data.total || 0)) break

  const last = contacts[contacts.length - 1]
  searchAfter = last?.searchAfter || [last?.id, last?.dateAdded].filter(Boolean)
  page++
  if (page > 20) break
}

const lines = all
  .map((c) => {
    const name =
      (c.contactName ||
        c.name ||
        [c.firstName, c.lastName].filter(Boolean).join(" ") ||
        "").trim() || "(sin nombre)"
    const phone = c.phone || c.phoneNormalized || "(sin número)"
    return `${name}, ${phone}`
  })
  .sort((a, b) => a.localeCompare(b, "es"))

console.log(`TOTAL=${all.length}`)
console.log(lines.join("\n"))
