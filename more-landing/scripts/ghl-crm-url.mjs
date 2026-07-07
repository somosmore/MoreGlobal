/**
 * URLs del panel GHL (white-label MORE).
 * Base por defecto: https://crm.moremigracion.com
 * Override opcional: GHL_CRM_URL en .env
 */

const DEFAULT_CRM_BASE = "https://crm.moremigracion.com"

export const getGhlCrmBase = (env = {}) => {
  const raw = (env.GHL_CRM_URL || DEFAULT_CRM_BASE).trim()
  return raw.replace(/\/+$/, "")
}

export const ghlWorkflowUrl = (locationId, workflowId, env = {}) =>
  `${getGhlCrmBase(env)}/v2/location/${locationId}/automation/workflows/${workflowId}`

export const ghlWorkflowsListUrl = (locationId, env = {}) =>
  `${getGhlCrmBase(env)}/v2/location/${locationId}/automation/workflows`

export const ghlContactUrl = (locationId, contactId, env = {}) =>
  `${getGhlCrmBase(env)}/v2/location/${locationId}/contacts/detail/${contactId}`

export const ghlEmailTemplatesUrl = (locationId, env = {}) =>
  `${getGhlCrmBase(env)}/v2/location/${locationId}/marketing/emails/all`

export const ghlPipelinesUrl = (locationId, env = {}) =>
  `${getGhlCrmBase(env)}/v2/location/${locationId}/opportunities/pipelines`
