import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

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
    const { nombre, email, phone, pais, utm_source, utm_medium, utm_campaign, utm_content, utm_term } = body

    if (!nombre || !email || !phone || !pais) {
      return new Response(
        JSON.stringify({ error: "Faltan campos requeridos" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

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
    const lastName = nameParts.slice(1).join(" ") || ""

    const supabaseInsert = supabase.from("masterclass_leads").insert({
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: phone,
      country: pais,
      source: "masterclass-eb2niw-2026",
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

        const contactRes = await fetch(
          "https://services.leadconnectorhq.com/contacts/upsert",
          {
            method: "POST",
            headers: ghlHeaders,
            body: JSON.stringify({
              locationId: ghlLocationId,
              firstName,
              lastName,
              email: email.trim().toLowerCase(),
              phone,
              source: "Masterclass EB2-NIW",
              tags: [ghlTag],
              customFields: [
                { id: "contact.pas_de_origen", field_value: pais },
              ],
            }),
          }
        )

        if (!contactRes.ok) {
          console.error("GHL contact upsert failed:", await contactRes.text())
          return
        }

        const contactData = await contactRes.json()
        const contactId = contactData?.contact?.id

        if (contactId) {
          const oppRes = await fetch(
            "https://services.leadconnectorhq.com/opportunities/",
            {
              method: "POST",
              headers: ghlHeaders,
              body: JSON.stringify({
                pipelineId: ghlPipelineId,
                pipelineStageId: ghlStageId,
                locationId: ghlLocationId,
                contactId,
                name: `${nombre.trim()} — Masterclass EB2-NIW`,
                status: "open",
                monetaryValue: 0,
              }),
            }
          )

          if (!oppRes.ok) {
            console.error("GHL opportunity creation failed:", await oppRes.text())
          }
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
