import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Quote, Scale, User, ArrowRight, Video } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
  supabase,
  CATEGORY_LABELS,
  type Testimonial,
} from "@/lib/supabase"
import { useTranslation } from "react-i18next"

type VideoSource = "youtube" | "vimeo" | "drive" | "other"

function getVideoInfo(url: string): {
  type: VideoSource
  embedUrl: string
  videoId?: string
  thumbnailUrl?: string
} | null {
  if (!url?.trim()) return null
  const u = url.trim()
  const ytMatch = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (ytMatch) {
    return {
      type: "youtube",
      videoId: ytMatch[1],
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&playsinline=1`,
      thumbnailUrl: `https://i.ytimg.com/vi/${ytMatch[1]}/hqdefault.jpg`,
    }
  }
  const vimeoMatch = u.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) {
    return {
      type: "vimeo",
      videoId: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1`,
    }
  }
  const driveMatch = u.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (driveMatch) {
    return {
      type: "drive",
      embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
    }
  }
  return null
}

const vimeoThumbnailCache = new Map<string, string | null>()

async function fetchVimeoThumbnail(videoUrl: string): Promise<string | null> {
  if (vimeoThumbnailCache.has(videoUrl)) {
    return vimeoThumbnailCache.get(videoUrl) ?? null
  }
  try {
    const resp = await fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}`
    )
    if (!resp.ok) {
      vimeoThumbnailCache.set(videoUrl, null)
      return null
    }
    const data = (await resp.json()) as { thumbnail_url?: string }
    const thumbnail = data.thumbnail_url ?? null
    vimeoThumbnailCache.set(videoUrl, thumbnail)
    return thumbnail
  } catch {
    vimeoThumbnailCache.set(videoUrl, null)
    return null
  }
}

const IVON_AUTO_PLAY_INTERVAL = 5500

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { t } = useTranslation()
  const displayTimeline = testimonial.status_label ?? testimonial.timeline ?? ""
  const catKey = `success.categories.${testimonial.category}`
  const categoryLabel = t(catKey, {
    defaultValue: CATEGORY_LABELS[testimonial.category] ?? testimonial.category,
  })

  return (
    <Card className="border-0 shadow-lg overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow">
      <CardContent className="p-5 sm:p-6 flex flex-col flex-1">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#2A3A4A]/10 text-[#2A3A4A] text-xs font-medium w-fit mb-3">
          {categoryLabel}
        </span>
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#2A3A4A] to-[#3A4D5E] flex items-center justify-center shrink-0">
            {testimonial.photo_url ? (
              <img
                src={testimonial.photo_url}
                alt={testimonial.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover z-10"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            ) : null}
            <User className="w-6 h-6 text-[#F37021] relative z-0" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-[#2A3A4A] text-base truncate">{testimonial.name}</h4>
            {(testimonial.country || testimonial.role) && (
              <p className="text-xs text-gray-500 truncate">
                {[testimonial.country, testimonial.role].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </div>
        <Quote className="w-6 h-6 text-[#F37021]/20 mb-2" />
        <p className="text-gray-600 text-sm leading-relaxed italic flex-1 line-clamp-4 whitespace-pre-line">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        {displayTimeline && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium mt-3 w-fit">
            {displayTimeline}
          </span>
        )}
      </CardContent>
    </Card>
  )
}

function VideoTestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const { t } = useTranslation()
  const [playing, setPlaying] = useState(false)
  const [vimeoThumbnailUrl, setVimeoThumbnailUrl] = useState<string | null>(null)
  const [thumbnailError, setThumbnailError] = useState(false)
  const info = getVideoInfo(testimonial.video_url ?? "")
  const displayTimeline = testimonial.status_label ?? testimonial.timeline ?? ""

  const embedUrl = info
    ? info.type === "youtube"
      ? `https://www.youtube.com/embed/${info.videoId}?autoplay=1&rel=0&modestbranding=1`
      : info.type === "vimeo"
      ? `https://player.vimeo.com/video/${info.videoId}?autoplay=1&muted=1`
      : info.embedUrl
    : null

  const handlePlay = () => {
    if (embedUrl) setPlaying(true)
  }

  const handleKeyDownPlay = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") handlePlay()
  }

  useEffect(() => {
    setThumbnailError(false)
  }, [testimonial.video_thumbnail_url, testimonial.video_url])

  useEffect(() => {
    setVimeoThumbnailUrl(null)
    if (
      testimonial.video_thumbnail_url ||
      !testimonial.video_url ||
      info?.type !== "vimeo"
    ) {
      return
    }
    let active = true
    fetchVimeoThumbnail(testimonial.video_url).then((thumbnail) => {
      if (active) setVimeoThumbnailUrl(thumbnail)
    })
    return () => {
      active = false
    }
  }, [testimonial.video_thumbnail_url, testimonial.video_url, info?.type])

  const autoThumbnailUrl =
    info?.type === "vimeo" ? vimeoThumbnailUrl : info?.thumbnailUrl ?? null
  const previewImageUrl =
    testimonial.video_thumbnail_url ?? autoThumbnailUrl

  const name = testimonial.name

  return (
    <Card className="border-0 shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow">
      <CardContent className="p-0 flex flex-col flex-1">
        <div className="relative aspect-video bg-[#2A3A4A]">
          {playing && embedUrl ? (
            <iframe
              src={embedUrl}
              title={t("success.videoIframeTitle", { name })}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <>
              {previewImageUrl && !thumbnailError ? (
                <img
                  src={previewImageUrl}
                  alt={t("success.videoThumbnailAlt", { name })}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => setThumbnailError(true)}
                />
              ) : null}
              {(!previewImageUrl || thumbnailError) && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#2A3A4A]">
                  <Video className="w-10 h-10 text-white/45" />
                </div>
              )}

              {embedUrl ? (
                <button
                  type="button"
                  aria-label={t("success.videoPlayAria", { name })}
                  tabIndex={0}
                  onClick={handlePlay}
                  onKeyDown={handleKeyDownPlay}
                  className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
                >
                  <span className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-xl">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-7 h-7 text-[#F37021] translate-x-0.5"
                      aria-hidden="true"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </button>
              ) : testimonial.video_url ? (
                <a
                  href={testimonial.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("success.videoExternalAria", { name })}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors text-white"
                >
                  <span className="text-sm font-medium">{t("success.watchVideo")}</span>
                </a>
              ) : null}
            </>
          )}
        </div>

        <div className="px-4 py-3 flex flex-col gap-1 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2A3A4A] to-[#3A4D5E] flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 text-[#F37021]" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[#2A3A4A] text-sm truncate">{testimonial.name}</p>
              {(testimonial.country || testimonial.role) && (
                <p className="text-xs text-gray-400 truncate">
                  {[testimonial.country, testimonial.role].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
          </div>
          {displayTimeline && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium w-fit mt-0.5">
              {displayTimeline}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Success() {
  const { t } = useTranslation()
  const [activeIvonSlide, setActiveIvonSlide] = useState(0)
  const [ivonPaused, setIvonPaused] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  const ivonSlides = t("success.ivonSlides", { returnObjects: true }) as string[]

  useEffect(() => {
    if (ivonPaused) return
    const timer = setInterval(() => {
      setActiveIvonSlide((prev) => (prev + 1) % ivonSlides.length)
    }, IVON_AUTO_PLAY_INTERVAL)
    return () => clearInterval(timer)
  }, [ivonPaused, ivonSlides.length])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id")
      .then(({ data, error }) => {
        setLoading(false)
        if (!error && data) setTestimonials(data as Testimonial[])
      })
  }, [])

  const textPhotoTestimonials = testimonials.filter(
    (item) => item.media_type === "text_photo"
  )
  const videoTestimonials = testimonials.filter(
    (item) => item.media_type === "video" && item.video_url
  )

  const ivonStats = [
    { value: "200+", label: t("success.statApproved") },
    { value: "98%", label: t("success.statSuccessRate") },
    { value: "10+", label: t("success.statYears") },
  ]

  return (
    <section id="exito" className="py-28 sm:py-36 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-[#2A3A4A] to-[#3A4D5E]">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <Scale className="w-5 h-5 text-[#F37021]" />
                    <span className="text-xs font-semibold tracking-[0.15em] uppercase text-[#F37021]">
                      {t("success.eyebrow")}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {t("success.ivonName")}
                  </h3>
                  <p className="text-white/50 text-sm font-medium mb-1">
                    {t("success.ivonTitle")}
                  </p>
                  <p className="text-[#F37021] text-sm font-medium mb-5">
                    {t("success.ivonExpertise")}
                  </p>

                  <div
                    className="min-h-[140px] sm:min-h-[160px] mb-6 flex flex-col justify-center"
                    onMouseEnter={() => setIvonPaused(true)}
                    onMouseLeave={() => setIvonPaused(false)}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeIvonSlide}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col justify-center"
                      >
                        <p
                          className={`text-white/75 leading-[1.65] ${
                            activeIvonSlide === 0
                              ? "text-[15px] sm:text-base font-medium"
                              : "text-[14px] sm:text-[15px]"
                          }`}
                        >
                          {ivonSlides[activeIvonSlide]}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-center gap-2 mt-4">
                      {ivonSlides.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setActiveIvonSlide(i)}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            i === activeIvonSlide
                              ? "w-6 bg-[#F37021]"
                              : "w-1.5 bg-white/30 hover:bg-white/50"
                          }`}
                          aria-label={t("success.slideAriaLabel", { slide: i + 1 })}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {ivonStats.map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-[#F37021]">
                          {stat.value}
                        </div>
                        <div className="text-xs text-white/50 mt-1">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col h-full min-h-0">
                  <div className="relative w-full flex-1 min-h-[320px] aspect-[4/5] sm:aspect-[16/10] lg:aspect-auto lg:min-h-0 lg:h-full overflow-hidden">
                    <img
                      src="/ivon.png"
                      alt={t("success.ivonImageAlt")}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover object-[center_67%]"
                    />
                    <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-[#2A3A4A]/95 via-[#2A3A4A]/40 to-transparent" />
                    <div className="hidden lg:block absolute bottom-0 left-0 right-0 pl-8 pr-8 pt-6 pb-0 sm:pl-10 sm:pr-10 sm:pt-6 lg:pl-12 lg:pr-12 lg:pt-8 text-left">
                      <p className="text-white/95 text-sm sm:text-base italic leading-relaxed max-w-xl h-0">
                        &ldquo;{t("success.ivonQuote")}&rdquo;
                      </p>
                      <img
                        src="/logo_more_dark.png"
                        alt={t("success.logoAlt")}
                        className="h-40 mt-2 opacity-90 w-auto"
                      />
                    </div>
                  </div>
                  <div className="lg:hidden bg-[#2A3A4A] px-6 py-5 sm:px-8 sm:py-6">
                    <p className="text-white/95 text-sm sm:text-base italic leading-relaxed mb-4">
                      &ldquo;{t("success.ivonQuote")}&rdquo;
                    </p>
                    <img
                      src="/logo_more_dark.png"
                      alt={t("success.logoAlt")}
                      className="h-12 sm:h-14 w-auto opacity-90"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2A3A4A] tracking-tight">
            <span className="text-[#F37021]">{t("success.casesTitleLead")}</span>{" "}
            {t("success.casesTitleMid")}{" "}
            <span className="text-[#F37021]">{t("success.casesTitleHighlight")}</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
            <span className="font-semibold text-[#2A3A4A]">{t("success.casesStrong1")}</span>
            {t("success.casesSubBefore")}
            <span className="font-semibold text-[#2A3A4A]">{t("success.casesStrong2")}</span>
            {t("success.casesSubAfter")}
            <span className="font-semibold text-[#F37021]">{t("success.casesSubHighlight")}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              {t("success.loading")}
            </div>
          ) : textPhotoTestimonials.length === 0 && videoTestimonials.length === 0 ? (
            <div className="text-center py-12 text-gray-500 max-w-md mx-auto">
              {t("success.empty")}
            </div>
          ) : (
            <>
              {textPhotoTestimonials.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence mode="popLayout">
                    {textPhotoTestimonials.map((item, i) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.03 }}
                      >
                        <TestimonialCard testimonial={item} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {videoTestimonials.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="mt-24 pt-16 border-t border-gray-200"
                >
                  <div className="text-center max-w-xl mx-auto mb-12">
                    <h3 className="text-2xl sm:text-3xl font-bold text-[#2A3A4A] tracking-tight">
                      {t("success.videoTitleLead")}{" "}
                      <span className="text-[#F37021]">{t("success.videoTitleHighlight")}</span>
                    </h3>
                    <p className="mt-3 text-base text-gray-500">
                      {t("success.videoSubtitle")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videoTestimonials.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      >
                        <VideoTestimonialCard testimonial={item} />
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-14 flex flex-col items-center gap-3 text-center"
                  >
                    <p className="text-sm text-gray-500 font-medium">
                      {t("success.videoIdentify")}
                    </p>
                    <a
                      href="#quiz"
                      className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#F37021] text-white font-semibold text-base hover:bg-[#d95f10] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#F37021]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F37021] focus-visible:ring-offset-2"
                      tabIndex={0}
                      aria-label={t("success.videoCtaAria")}
                    >
                      {t("success.videoCta")}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-base font-semibold text-[#2A3A4A] mt-16"
        >
          {t("success.bridgePricing")}
        </motion.p>
      </div>
    </section>
  )
}
