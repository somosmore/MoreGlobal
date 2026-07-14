import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Quote, Scale, User, ArrowRight, Video } from "lucide-react"
import { CtaButton } from "@/components/brand/CtaButton"
import { SectionHeading } from "@/components/brand/SectionHeading"
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
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-navy/15 bg-white shadow-[0_24px_60px_-30px_rgba(27,43,68,0.18)]">
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <span className="mb-3 inline-flex w-fit items-center rounded-full border border-navy/15 bg-paper px-2.5 py-1 text-xs font-medium text-navy">
          {categoryLabel}
        </span>
        <div className="mb-3 flex items-center gap-3">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-navy-deep">
            {testimonial.photo_url ? (
              <img
                src={testimonial.photo_url}
                alt={testimonial.name}
                loading="lazy"
                className="absolute inset-0 z-10 h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            ) : null}
            <User className="relative z-0 h-6 w-6 text-orange-light" aria-hidden />
          </div>
          <div className="min-w-0">
            <h4 className="truncate font-display text-base text-navy-deep">{testimonial.name}</h4>
            {(testimonial.country || testimonial.role) && (
              <p className="truncate text-xs text-ink-muted">
                {[testimonial.country, testimonial.role].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </div>
        <Quote className="mb-2 h-6 w-6 text-orange/30" aria-hidden />
        <p className="flex-1 whitespace-pre-line text-sm leading-relaxed italic text-ink-muted line-clamp-4">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
        {displayTimeline && (
          <span className="mt-3 inline-flex w-fit items-center rounded-full border border-navy/10 bg-paper-warm px-2.5 py-1 text-xs font-medium text-navy">
            {displayTimeline}
          </span>
        )}
      </div>
    </article>
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
    <article className="flex flex-col overflow-hidden rounded-3xl border border-navy/15 bg-white shadow-[0_24px_60px_-30px_rgba(27,43,68,0.18)]">
      <div className="relative aspect-video bg-navy-deep">
        {playing && embedUrl ? (
          <iframe
            src={embedUrl}
            title={t("success.videoIframeTitle", { name })}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <>
            {previewImageUrl && !thumbnailError ? (
              <img
                src={previewImageUrl}
                alt={t("success.videoThumbnailAlt", { name })}
                className="absolute inset-0 h-full w-full object-cover"
                onError={() => setThumbnailError(true)}
              />
            ) : null}
            {(!previewImageUrl || thumbnailError) && (
              <div className="absolute inset-0 flex items-center justify-center bg-navy-deep">
                <Video className="h-10 w-10 text-white/45" aria-hidden />
              </div>
            )}

            {embedUrl ? (
              <button
                type="button"
                aria-label={t("success.videoPlayAria", { name })}
                tabIndex={0}
                onClick={handlePlay}
                onKeyDown={handleKeyDownPlay}
                className="group absolute inset-0 flex h-full w-full items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 transition-all duration-200 group-hover:scale-105 group-hover:bg-white">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-7 w-7 translate-x-0.5 text-orange"
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
                className="absolute inset-0 flex items-center justify-center bg-black/30 text-white transition-colors hover:bg-black/40"
              >
                <span className="text-sm font-medium">{t("success.watchVideo")}</span>
              </a>
            ) : null}
          </>
        )}
      </div>

      <div className="flex flex-col gap-1 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-deep">
            <User className="h-3.5 w-3.5 text-orange-light" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-sm text-navy-deep">{testimonial.name}</p>
            {(testimonial.country || testimonial.role) && (
              <p className="truncate text-xs text-ink-muted">
                {[testimonial.country, testimonial.role].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </div>
        {displayTimeline && (
          <span className="mt-0.5 inline-flex w-fit items-center rounded-full border border-navy/10 bg-paper-warm px-2 py-0.5 text-xs font-medium text-navy">
            {displayTimeline}
          </span>
        )}
      </div>
    </article>
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
    <section id="exito" className="relative overflow-hidden bg-paper-warm py-28 sm:py-36">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="overflow-hidden rounded-3xl border border-navy/15 bg-navy-deep shadow-[0_24px_60px_-30px_rgba(27,43,68,0.45)]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
                <div className="mb-3 flex items-center gap-3">
                  <Scale className="h-5 w-5 text-orange-light" aria-hidden />
                  <span className="font-display text-sm italic text-orange-light">
                    {t("success.eyebrow")}
                  </span>
                </div>
                <h3 className="mb-1 font-display text-2xl text-white sm:text-3xl">
                  {t("success.ivonName")}
                </h3>
                <p className="mb-1 text-sm font-medium text-white/50">
                  {t("success.ivonTitle")}
                </p>
                <p className="mb-5 text-sm font-medium text-orange-light">
                  {t("success.ivonExpertise")}
                </p>

                <div
                  className="mb-6 flex min-h-[140px] flex-col justify-center sm:min-h-[160px]"
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
                        className={`leading-[1.65] text-white/75 ${
                          activeIvonSlide === 0
                            ? "text-[15px] font-medium sm:text-base"
                            : "text-[14px] sm:text-[15px]"
                        }`}
                      >
                        {ivonSlides[activeIvonSlide]}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-4 flex justify-center gap-2">
                    {ivonSlides.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveIvonSlide(i)}
                        className={`h-1.5 cursor-pointer rounded-full transition-all duration-300 ${
                          i === activeIvonSlide
                            ? "w-6 bg-orange"
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
                      <div className="font-display text-2xl text-orange-light sm:text-3xl">
                        {stat.value}
                      </div>
                      <div className="mt-1 text-xs text-white/50">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex h-full min-h-0 flex-col">
                <div className="relative aspect-[4/5] w-full min-h-[320px] flex-1 overflow-hidden sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-0">
                  <img
                    src="/ivon.png"
                    alt={t("success.ivonImageAlt")}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-[center_67%]"
                  />
                  <div className="absolute inset-0 hidden bg-gradient-to-t from-navy-deep/95 via-navy-deep/40 to-transparent lg:block" />
                  <div className="absolute right-0 bottom-0 left-0 hidden pt-6 pr-8 pb-0 pl-8 text-left sm:pt-6 sm:pr-10 sm:pl-10 lg:block lg:pt-8 lg:pr-12 lg:pl-12">
                    <p className="h-0 max-w-xl text-sm leading-relaxed text-white/95 italic sm:text-base">
                      &ldquo;{t("success.ivonQuote")}&rdquo;
                    </p>
                    <img
                      src="/logo_more_dark.png"
                      alt={t("success.logoAlt")}
                      className="mt-2 h-40 w-auto opacity-90"
                    />
                  </div>
                </div>
                <div className="bg-navy-deep px-6 py-5 sm:px-8 sm:py-6 lg:hidden">
                  <p className="mb-4 text-sm leading-relaxed text-white/95 italic sm:text-base">
                    &ldquo;{t("success.ivonQuote")}&rdquo;
                  </p>
                  <img
                    src="/logo_more_dark.png"
                    alt={t("success.logoAlt")}
                    className="h-12 w-auto opacity-90 sm:h-14"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-20"
        >
          <header className="text-center">
            <h2 className="text-balance font-display text-3xl leading-tight text-navy-deep sm:text-4xl lg:text-[2.75rem]">
              <span className="text-orange">{t("success.casesTitleLead")}</span>{" "}
              {t("success.casesTitleMid")}{" "}
              <span className="text-orange">{t("success.casesTitleHighlight")}</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl font-sans text-[15px] leading-relaxed text-ink-muted sm:text-base">
              <span className="font-semibold text-navy-deep">{t("success.casesStrong1")}</span>
              {t("success.casesSubBefore")}
              <span className="font-semibold text-navy-deep">{t("success.casesStrong2")}</span>
              {t("success.casesSubAfter")}
              <span className="font-semibold text-orange-dark">
                {t("success.casesSubHighlight")}
              </span>
            </p>
          </header>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {loading ? (
            <div className="py-12 text-center text-ink-muted">{t("success.loading")}</div>
          ) : textPhotoTestimonials.length === 0 && videoTestimonials.length === 0 ? (
            <div className="mx-auto max-w-md py-12 text-center text-ink-muted">
              {t("success.empty")}
            </div>
          ) : (
            <>
              {textPhotoTestimonials.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  className="mt-24 border-t border-navy/10 pt-16"
                >
                  <div className="mx-auto mb-12 max-w-xl">
                    <SectionHeading
                      title={`${t("success.videoTitleLead")} `}
                      highlight={t("success.videoTitleHighlight")}
                      description={t("success.videoSubtitle")}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                    <p className="text-sm font-medium text-ink-muted">
                      {t("success.videoIdentify")}
                    </p>
                    <CtaButton
                      label={t("success.videoCta")}
                      href="#quiz"
                      size="lg"
                      icon={ArrowRight}
                      ariaLabel={t("success.videoCtaAria")}
                      className="w-auto"
                    />
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
          className="mt-16 text-center font-display text-base text-navy-deep"
        >
          {t("success.bridgePricing")}
        </motion.p>
      </div>
    </section>
  )
}
