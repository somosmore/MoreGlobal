import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import {
  getClientIp,
  getMetaPixelId,
  hashEmailForMeta,
  hashPhoneForMeta,
  isTrackingEnabledForCapi,
  sendPixelCapi,
} from "../_shared/metaCapi.ts"

const COUNTRY_ISO: Record<string, string> = {
  "Colombia": "CO", "México": "MX", "Estados Unidos": "US",
  "Perú": "PE", "Chile": "CL", "Argentina": "AR",
  "Ecuador": "EC", "Venezuela": "VE", "Costa Rica": "CR",
  "Panamá": "PA", "Guatemala": "GT", "El Salvador": "SV",
  "Honduras": "HN", "Nicaragua": "NI", "Bolivia": "BO",
  "Paraguay": "PY", "Uruguay": "UY", "República Dominicana": "DO",
  "España": "ES", "Otro": "US",
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  try {
    const body = await req.json()
    const {
      nombre,
      email,
      phone,
      pais,
      profesion,
      source,
      event_label,
      ghl_tag,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      capi_event_id,
      client_user_agent,
      event_source_url,
      fbp,
      fbc,
    } = body

    if (!nombre || !email || !phone || !pais) {
      return new Response(
        JSON.stringify({ error: "Faltan campos requeridos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Permite reutilizar esta función para distintos eventos/webinars.
    // Si el frontend no envía `source`/`event_label`, se asume la masterclass.
    const leadSource =
      typeof source === "string" && source.trim()
        ? source.trim()
        : "masterclass-eb2niw-2026"
    const eventLabel =
      typeof event_label === "string" && event_label.trim()
        ? event_label.trim()
        : "Masterclass EB2-NIW"
    const profesionValue =
      typeof profesion === "string" && profesion.trim() ? profesion.trim() : null
    // Tag de GHL específico del evento; si no llega, cae al GHL_TAG por defecto.
    const eventTag =
      typeof ghl_tag === "string" && ghl_tag.trim() ? ghl_tag.trim() : null

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const ghlApiKey = Deno.env.get("GHL_API_KEY")
    const ghlLocationId = Deno.env.get("GHL_LOCATION_ID")
    const ghlPipelineId = Deno.env.get("GHL_PIPELINE_ID")
    const ghlStageId = Deno.env.get("GHL_STAGE_ID")
    const ghlTag = Deno.env.get("GHL_TAG")

    if (ghlApiKey) {
      const missingGhlEnv: string[] = []
      if (!ghlLocationId) missingGhlEnv.push("GHL_LOCATION_ID")
      if (!ghlPipelineId) missingGhlEnv.push("GHL_PIPELINE_ID")
      if (!ghlStageId) missingGhlEnv.push("GHL_STAGE_ID")
      if (!ghlTag) missingGhlEnv.push("GHL_TAG")

      if (missingGhlEnv.length > 0) {
        console.error(`Missing required GHL env vars: ${missingGhlEnv.join(", ")}`)
        return new Response(
          JSON.stringify({
            error: "Configuracion incompleta de GHL en el servidor",
            missing: missingGhlEnv,
          }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
    }

    const nameParts = nombre.trim().split(/\s+/)
    const firstName = nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "-"

    const supabaseInsert = supabase.from("masterclass_leads").insert({
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: phone,
      country: pais,
      profesion: profesionValue,
      source: leadSource,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      utm_content: utm_content || null,
      utm_term: utm_term || null,
      status: "new",
    })

    let ghlPromise: Promise<unknown> = Promise.resolve()

    if (ghlApiKey) {
      ghlPromise = (async () => {
        const ghlHeaders = {
          Authorization: `Bearer ${ghlApiKey}`,
          Version: "2021-07-28",
          "Content-Type": "application/json",
        }

        const contactPayload = {
          locationId: ghlLocationId,
          firstName,
          lastName,
          email: email.trim().toLowerCase(),
          phone: phone,
          country: COUNTRY_ISO[pais] || "US",
          source: eventLabel,
          tags: [eventTag || ghlTag],
          customFields: [
            { id: "2p21GBEtEn6ZmpPzKouP", field_value: pais },
          ],
        }
        console.log("[GHL] Contact upsert payload:", JSON.stringify(contactPayload))

        const contactRes = await fetch(
          "https://services.leadconnectorhq.com/contacts/upsert",
          {
            method: "POST",
            headers: ghlHeaders,
            body: JSON.stringify(contactPayload),
          }
        )

        const contactResText = await contactRes.text()
        console.log(`[GHL] Contact upsert response (${contactRes.status}):`, contactResText)

        if (!contactRes.ok) {
          console.error("[GHL] Contact upsert FAILED")
          return
        }

        const contactData = JSON.parse(contactResText)
        const contactId = contactData?.contact?.id
        console.log("[GHL] Contact ID:", contactId)

        if (contactId) {
          const oppPayload = {
            pipelineId: ghlPipelineId,
            pipelineStageId: ghlStageId,
            locationId: ghlLocationId,
            contactId,
            name: `${nombre.trim()} — ${eventLabel}`,
            status: "open",
            monetaryValue: 0,
          }
          console.log("[GHL] Opportunity payload:", JSON.stringify(oppPayload))

          const oppRes = await fetch(
            "https://services.leadconnectorhq.com/opportunities/",
            {
              method: "POST",
              headers: ghlHeaders,
              body: JSON.stringify(oppPayload),
            }
          )

          const oppResText = await oppRes.text()
          console.log(`[GHL] Opportunity response (${oppRes.status}):`, oppResText)
        }
      })()
    }

    const [dbResult] = await Promise.all([supabaseInsert, ghlPromise])

    if (dbResult.error) {
      console.error("Supabase insert error:", dbResult.error)
      return new Response(
        JSON.stringify({ error: "Error al guardar el registro" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const metaToken = Deno.env.get("META_ACCESS_TOKEN")?.trim()
    if (
      metaToken &&
      typeof capi_event_id === "string" &&
      capi_event_id.trim() &&
      typeof client_user_agent === "string" &&
      client_user_agent.trim() &&
      typeof event_source_url === "string" &&
      event_source_url.trim() &&
      (await isTrackingEnabledForCapi(supabase))
    ) {
      const pixelId = await getMetaPixelId(supabase)
      if (pixelId && /^\d+$/.test(pixelId)) {
        try {
          const emHash = await hashEmailForMeta(String(email))
          const phHash = await hashPhoneForMeta(String(phone))
          const userData: Record<string, unknown> = {
            em: [emHash],
            client_user_agent: String(client_user_agent).trim().slice(0, 2048),
          }
          if (phHash) userData.ph = [phHash]
          const ip = getClientIp(req)
          if (ip) userData.client_ip_address = ip
          if (typeof fbp === "string" && fbp.trim()) userData.fbp = fbp.trim()
          if (typeof fbc === "string" && fbc.trim()) userData.fbc = fbc.trim()

          const event_time = Math.floor(Date.now() / 1000)
          const capiData = [
            {
              event_name: "CompleteRegistration",
              event_time,
              event_id: capi_event_id.trim(),
              action_source: "website",
              event_source_url: String(event_source_url).trim().slice(0, 2048),
              user_data: userData,
              custom_data: {
                content_name: "form_flow_c",
                content_category: "content_view",
              },
            },
          ]
          const testCode = Deno.env.get("META_TEST_EVENT_CODE")?.trim() || null
          const capiRes = await sendPixelCapi(
            pixelId,
            metaToken,
            capiData,
            testCode
          )
          if (!capiRes.ok) {
            console.error(
              "[masterclass-register] Meta CAPI error:",
              capiRes.status,
              capiRes.body
            )
          }
        } catch (capiErr) {
          console.error("[masterclass-register] Meta CAPI exception:", capiErr)
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (err) {
    console.error("Unexpected error:", err)
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
