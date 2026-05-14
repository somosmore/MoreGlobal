import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import {
  getClientIp,
  getMetaPixelId,
  isTrackingEnabledForCapi,
  sendPixelCapi,
} from "../_shared/metaCapi.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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

  const metaToken = Deno.env.get("META_ACCESS_TOKEN")?.trim()
  if (!metaToken) {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (!(await isTrackingEnabledForCapi(supabase))) {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    const pixelId = await getMetaPixelId(supabase)
    if (!pixelId || !/^\d+$/.test(pixelId)) {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    const body = (await req.json()) as Record<string, unknown>
    const event_id = body.event_id
    const event_source_url = body.event_source_url
    const client_user_agent = body.client_user_agent

    if (
      typeof event_id !== "string" ||
      !event_id.trim() ||
      typeof event_source_url !== "string" ||
      !event_source_url.trim() ||
      typeof client_user_agent !== "string" ||
      !client_user_agent.trim()
    ) {
      return new Response(
        JSON.stringify({ error: "Faltan event_id, event_source_url o client_user_agent" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const userData: Record<string, unknown> = {
      client_user_agent: client_user_agent.trim().slice(0, 2048),
    }
    const ip = getClientIp(req)
    if (ip) userData.client_ip_address = ip
    if (typeof body.fbp === "string" && body.fbp.trim()) {
      userData.fbp = body.fbp.trim()
    }
    if (typeof body.fbc === "string" && body.fbc.trim()) {
      userData.fbc = body.fbc.trim()
    }

    const event_time = Math.floor(Date.now() / 1000)
    const data = [
      {
        event_name: "ViewContent",
        event_time,
        event_id: event_id.trim(),
        action_source: "website",
        event_source_url: event_source_url.trim().slice(0, 2048),
        user_data: userData,
        custom_data: {
          content_name: "svc_page_a",
          content_category: "content_view",
        },
      },
    ]

    const testCode = Deno.env.get("META_TEST_EVENT_CODE")?.trim() || null
    const result = await sendPixelCapi(pixelId, metaToken, data, testCode)
    if (!result.ok) {
      console.error(
        "[meta-capi-masterclass-view] Meta API error:",
        result.status,
        result.body
      )
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("[meta-capi-masterclass-view] Unexpected:", err)
    return new Response(JSON.stringify({ error: "Error interno" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
