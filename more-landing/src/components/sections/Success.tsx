import { useState, useEffect, useRef, useCallback, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Scale, User, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  supabase,
  CATEGORY_LABELS,
  type Testimonial,
} from "@/lib/supabase";

type VideoSource = "youtube" | "vimeo" | "drive" | "other";

function getVideoInfo(url: string): { type: VideoSource; embedUrl: string; videoId?: string } | null {
  if (!url?.trim()) return null;
  const u = url.trim();
  const ytMatch = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    return {
      type: "youtube",
      videoId: ytMatch[1],
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&playsinline=1`,
    };
  }
  const vimeoMatch = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return {
      type: "vimeo",
      videoId: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1`,
    };
  }
  const driveMatch = u.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch) {
    return {
      type: "drive",
      embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
    };
  }
  return null;
}

const ivonSummary =
  "Abogada colombiana radicada en EE. UU., especializada en identificar y potenciar talento latinoamericano. Ayuda a profesionales y emprendedores a lograr su residencia permanente mediante Planes de Alto Impacto de Interés Nacional.";

const ivonSlides = [
  ivonSummary,
  "Abogada colombiana, migró a EE. UU. hace cinco años con grandes sueños. Allí, descubrió su talento para identificar profesionales latinoamericanos excepcionales y se especializó en la gestión de proyectos sociales.",
  "Su misión es ayudar a estos profesionales a ser reconocidos como de Interés Nacional en EE. UU. mediante un Plan de Alto Impacto. Con un enfoque personalizado, ha logrado numerosos casos de éxito, facilitando el establecimiento significativo de familias de diversas naciones.",
  "La pasión de Ivon por empoderar a profesionales y emprendedores sigue creciendo. Su dedicación y trabajo en equipo han sido esenciales para descubrir y potenciar el talento latinoamericano, permitiendo que puedan alcanzar nuevas oportunidades en EE.UU. y expandirse con propósito en el país.",
];

const ivonData = {
  name: "Ivon MORE",
  title: "Abogada & Fundadora",
  expertise: "Experta en Gestión de Proyectos Sociales",
  stats: [
    { value: "200+", label: "Casos Aprobados" },
    { value: "98%", label: "Tasa de Éxito" },
    { value: "10+", label: "Años de Experiencia" },
  ],
};

const IVON_AUTO_PLAY_INTERVAL = 5500;

function TestimonialCard({ t }: { t: Testimonial }) {
  const displayTimeline = t.status_label ?? t.timeline ?? "";
  const categoryLabel = CATEGORY_LABELS[t.category];

  return (
    <Card className="border-0 shadow-lg overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow">
      <CardContent className="p-5 sm:p-6 flex flex-col flex-1">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#2A3A4A]/10 text-[#2A3A4A] text-xs font-medium w-fit mb-3">
          {categoryLabel}
        </span>
        <div className="flex items-center gap-3 mb-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#2A3A4A] to-[#3A4D5E] flex items-center justify-center shrink-0">
            {t.photo_url ? (
              <img
                src={t.photo_url}
                alt={t.name}
                className="absolute inset-0 w-full h-full object-cover z-10"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : null}
            <User className="w-6 h-6 text-[#F37021] relative z-0" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-[#2A3A4A] text-base truncate">{t.name}</h4>
            {(t.country || t.role) && (
              <p className="text-xs text-gray-500 truncate">{[t.country, t.role].filter(Boolean).join(" · ")}</p>
            )}
          </div>
        </div>
        <Quote className="w-6 h-6 text-[#F37021]/20 mb-2" />
        <p className="text-gray-600 text-sm leading-relaxed italic flex-1 line-clamp-4 whitespace-pre-line">
          &ldquo;{t.quote}&rdquo;
        </p>
        {displayTimeline && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium mt-3 w-fit">
            {displayTimeline}
          </span>
        )}
      </CardContent>
    </Card>
  );
}

declare global {
  interface Window {
    YT?: {
      ready: (fn: () => void) => void;
      Player: new (
        el: string | HTMLElement,
        opts: { videoId: string; playerVars?: Record<string, number | string> }
      ) => { unMute: () => void; setVolume: (n: number) => void };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

function loadYouTubeAPI(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  return new Promise((resolve) => {
    if (window.YT) {
      window.YT.ready!(resolve);
      return;
    }
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(tag, firstScript);
    window.onYouTubeIframeAPIReady = () => {
      window.YT?.ready?.(resolve);
    };
  });
}

function VideoTestimonialCard({ videoUrl }: { videoUrl: string }) {
  const info = getVideoInfo(videoUrl);
  const [showUnmute, setShowUnmute] = useState(!!info);
  const playerRef = useRef<{ unMute: () => void; setVolume: (n: number) => void } | null>(null);
  const containerId = useId().replace(/:/g, "");

  useEffect(() => {
    if (!info || info.type !== "youtube" || !info.videoId) return;
    let cancelled = false;
    loadYouTubeAPI().then(() => {
      if (cancelled || !window.YT) return;
      const el = document.getElementById(containerId);
      if (!el) return;
      playerRef.current = new window.YT.Player(containerId, {
        videoId: info.videoId!,
        playerVars: { autoplay: 1, mute: 1, playsinline: 1 },
      });
    });
    return () => {
      cancelled = true;
    };
  }, [info?.videoId, containerId]);

  const handleUnmute = useCallback(() => {
    if (info?.type === "youtube" && playerRef.current) {
      try {
        playerRef.current.unMute();
        playerRef.current.setVolume(100);
      } catch {
        // ignore
      }
      setShowUnmute(false);
    } else {
      window.open(videoUrl, "_blank", "noopener,noreferrer");
      setShowUnmute(false);
    }
  }, [info?.type, videoUrl]);

  if (!info) {
    return (
      <Card className="border-0 shadow-lg overflow-hidden h-full flex flex-col">
        <CardContent className="p-0 flex flex-col flex-1">
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex aspect-video items-center justify-center bg-[#2A3A4A] text-white hover:bg-[#3A4D5E] transition-colors"
          >
            <span className="text-sm font-medium">Ver video</span>
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow">
      <CardContent className="p-0 flex flex-col flex-1">
        <div className="relative aspect-video bg-[#2A3A4A]">
          {info.type === "youtube" ? (
            <div id={containerId} className="absolute inset-0 w-full h-full" />
          ) : (
            <iframe
              src={info.embedUrl}
              title="Testimonio en video"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
          {showUnmute && (
            <button
              type="button"
              onClick={handleUnmute}
              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Activar sonido"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/90 text-[#2A3A4A] text-sm font-medium hover:bg-white transition-colors shadow-lg">
                <Volume2 className="w-5 h-5" />
                Activar sonido
              </span>
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Success() {
  const [activeIvonSlide, setActiveIvonSlide] = useState(0);
  const [ivonPaused, setIvonPaused] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (ivonPaused) return;
    const timer = setInterval(() => {
      setActiveIvonSlide((prev) => (prev + 1) % ivonSlides.length);
    }, IVON_AUTO_PLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [ivonPaused]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("id")
      .then(({ data, error }) => {
        setLoading(false);
        if (!error && data) setTestimonials(data as Testimonial[]);
      });
  }, []);

  const textPhotoTestimonials = testimonials.filter(
    (t) => t.media_type === "text_photo"
  );
  const videoTestimonials = testimonials.filter(
    (t) => t.media_type === "video" && t.video_url
  );

  return (
    <section id="exito" className="py-28 sm:py-36 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ivon Section */}
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
                      Liderazgo
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                    {ivonData.name}
                  </h3>
                  <p className="text-white/50 text-sm font-medium mb-1">
                    {ivonData.title}
                  </p>
                  <p className="text-[#F37021] text-sm font-medium mb-5">
                    {ivonData.expertise}
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
                          aria-label={`Ir al slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {ivonData.stats.map((stat) => (
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
                      alt="Ivon MORE - Abogada y Fundadora"
                      className="absolute inset-0 w-full h-full object-cover object-[center_67%]"
                    />
                    <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-[#2A3A4A]/95 via-[#2A3A4A]/40 to-transparent" />
                    <div className="hidden lg:block absolute bottom-0 left-0 right-0 pl-8 pr-8 pt-6 pb-0 sm:pl-10 sm:pr-10 sm:pt-6 lg:pl-12 lg:pr-12 lg:pt-8 text-left">
                      <p className="text-white/95 text-sm sm:text-base italic leading-relaxed max-w-xl h-0">
                        &ldquo;Cada profesional tiene una historia extraordinaria. Nosotros la hacemos visible.&rdquo;
                      </p>
                      <img
                        src="/logo_more_dark.png"
                        alt="MORE"
                        className="h-40 mt-2 opacity-90 w-auto"
                      />
                    </div>
                  </div>
                  <div className="lg:hidden bg-[#2A3A4A] px-6 py-5 sm:px-8 sm:py-6">
                    <p className="text-white/95 text-sm sm:text-base italic leading-relaxed mb-4">
                      &ldquo;Cada profesional tiene una historia extraordinaria. Nosotros la hacemos visible.&rdquo;
                    </p>
                    <img
                      src="/logo_more_dark.png"
                      alt="MORE"
                      className="h-12 sm:h-14 w-auto opacity-90"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bridge header: Casos de éxito — texto con palabras clave */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2A3A4A] tracking-tight">
            <span className="text-[#F37021]">Casos de éxito.</span> Resultados que{" "}
            <span className="text-[#F37021]">hablan por sí solos</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg text-gray-600 leading-relaxed">
            <span className="font-semibold text-[#2A3A4A]">Profesionales reales</span>,{" "}
            <span className="font-semibold text-[#2A3A4A]">aprobaciones reales</span>. Conoce a quienes ya construyeron su{" "}
            <span className="font-semibold text-[#F37021]">legado en EE.UU.</span>
          </p>
        </motion.div>

        {/* Testimonios texto + foto por categoría */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              Cargando testimonios…
            </div>
          ) : textPhotoTestimonials.length === 0 && videoTestimonials.length === 0 ? (
            <div className="text-center py-12 text-gray-500 max-w-md mx-auto">
              Próximamente más casos de éxito. Los testimonios se gestionan desde el panel de administración.
            </div>
          ) : (
            <>
              {textPhotoTestimonials.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence mode="popLayout">
                    {textPhotoTestimonials.map((t, i) => (
                        <motion.div
                          key={t.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.03 }}
                        >
                        <TestimonialCard t={t} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Testimonios en video (sección abajo) */}
              {videoTestimonials.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className="mt-24 pt-16 border-t border-gray-200"
                >
                 
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videoTestimonials.map((t) => (
                      <motion.div
                        key={t.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                      >
                        <VideoTestimonialCard videoUrl={t.video_url!} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>

      </div>
    </section>
  );
}
