import { useRef, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { ImageIcon, Upload, X, Loader2 } from "lucide-react"

interface ImageUploaderProps {
  value: string | null
  onUpload: (url: string) => void
  onRemove: () => void
  bucket?: string
  label?: string
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const MAX_SIZE_MB = 5

export const ImageUploader = ({
  value,
  onUpload,
  onRemove,
  bucket = "video-thumbnails",
  label = "Foto de portada",
}: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processFile = useCallback(
    async (file: File) => {
      setError(null)

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Solo se aceptan imágenes JPG, PNG, WebP o GIF.")
        return
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`El archivo no puede superar ${MAX_SIZE_MB} MB.`)
        return
      }
      if (!supabase) {
        setError("Supabase no está configurado.")
        return
      }

      setUploading(true)

      const ext = file.name.split(".").pop() ?? "jpg"
      const fileName = `${crypto.randomUUID()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: false, contentType: file.type })

      if (uploadError) {
        setError(uploadError.message)
        setUploading(false)
        return
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
      onUpload(data.publicUrl)
      setUploading(false)
    },
    [bucket, onUpload]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ""
  }

  const handleClick = () => inputRef.current?.click()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") handleClick()
  }

  if (value) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="relative rounded-xl overflow-hidden border border-gray-200 aspect-video bg-gray-50 group">
          <img
            src={value}
            alt="Portada del video"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleClick}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 text-sm font-medium text-gray-800 hover:bg-white transition-colors"
            >
              <Upload className="w-4 h-4" />
              Cambiar
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/90 text-sm font-medium text-white hover:bg-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
              Quitar
            </button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
          aria-label="Cambiar imagen de portada"
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div
        role="button"
        tabIndex={0}
        aria-label="Subir imagen de portada. Haz click o arrastra una imagen"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!uploading ? handleClick : undefined}
        onKeyDown={handleKeyDown}
        className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed aspect-video cursor-pointer transition-colors select-none ${
          isDragging
            ? "border-[#F37021] bg-[#F37021]/5"
            : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100/50"
        } ${uploading ? "pointer-events-none" : ""}`}
      >
        {uploading ? (
          <>
            <Loader2 className="w-8 h-8 text-[#F37021] animate-spin" />
            <p className="text-sm text-gray-500">Subiendo imagen…</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-[#F37021]/10 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-[#F37021]" />
            </div>
            <div className="text-center px-4">
              <p className="text-sm font-medium text-gray-700">
                Arrastra una imagen aquí
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                o haz click para seleccionar · JPG, PNG, WebP · Máx. {MAX_SIZE_MB} MB
              </p>
            </div>
          </>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <X className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
        aria-label="Seleccionar imagen de portada"
      />
    </div>
  )
}
