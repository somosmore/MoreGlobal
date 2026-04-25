export const normalizeResourceUrl = (url: string) => {
  const trimmedUrl = url.trim()
  if (!trimmedUrl) return ""

  const isAbsoluteUrl = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmedUrl) || trimmedUrl.startsWith("//")
  if (isAbsoluteUrl || trimmedUrl.startsWith("/")) return trimmedUrl

  const isDomainLikeUrl =
    /^(localhost(:\d+)?|([\w-]+\.)+[a-zA-Z]{2,})(:\d+)?(\/|$|\?|#)/.test(trimmedUrl)
  if (isDomainLikeUrl) return `https://${trimmedUrl}`

  return `/${trimmedUrl}`
}
