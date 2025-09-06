import { createWriteStream, existsSync } from "fs"
import { Readable } from "node:stream"
import { pipeline } from "node:stream/promises"
import type { ReadableStream as WebReadableStream } from "node:stream/web"
import path from "path"
import { mkdir } from "fs/promises"

export const runtime = "nodejs"

const MAX_BYTES: number = 25 * 1024 * 1024 // 25MB
const ALLOWED_PREFIX: readonly string[] = ["image/", "video/"] as const
const ALLOWED_EXTENSIONS: readonly string[] = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".heic",
  ".heif",
  ".mp4",
  ".webm",
  ".mov",
  ".m4v",
  ".avi",
] as const

function inferKind(mime: string, fileName: string): "image" | "video" {
  if (mime.startsWith("video/")) return "video"
  const lower = (fileName || "").toLowerCase()
  const videoExts = [".mp4", ".webm", ".mov", ".m4v", ".avi"] as const
  if (videoExts.some((ext) => lower.endsWith(ext))) return "video"
  return "image"
}

/**
 * POST /api/uploads
 * Accepts multipart/form-data with field "file" (single file per request).
 * Saves into public/uploads and returns a public URL.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    const formData: FormData = await req.formData()
    const file: File | null = formData.get("file") as File | null
    if (!file) return Response.json({ error: "Missing file" }, { status: 400 })

    const mime: string = file.type || ""
    const nameLower: string = (file.name || "").toLowerCase()
    const hasAllowedMime: boolean = ALLOWED_PREFIX.some((p) => mime.startsWith(p))
    const hasAllowedExt: boolean = ALLOWED_EXTENSIONS.some((ext) => nameLower.endsWith(ext))
    if (!hasAllowedMime && !hasAllowedExt) {
      return Response.json({ error: "Unsupported file type" }, { status: 415 })
    }

    if (file.size > MAX_BYTES) {
      return Response.json({ error: "File too large" }, { status: 413 })
    }

    const uploadsDir: string = path.join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const safeBase: string = (file.name || "upload")
      .toLowerCase()
      .replace(/[^a-z0-9.]+/g, "-")
      .replace(/^-+|-+$/g, "")

    const timestamp: number = Date.now()
    const fileName: string = `${timestamp}-${safeBase}`
    const filePath: string = path.join(uploadsDir, fileName)
    // Stream the upload to disk to reduce memory usage
    const webStream: WebReadableStream<Uint8Array> = (
      file as unknown as { stream: () => WebReadableStream<Uint8Array> }
    ).stream()
    const nodeStream = Readable.fromWeb(webStream)
    const out = createWriteStream(filePath)
    await pipeline(nodeStream, out)

    const url: string = `/uploads/${fileName}`
    const kind: "image" | "video" = inferKind(mime, fileName)

    return Response.json({ url, kind }, { status: 201 })
  } catch (e) {
    const message: string = e instanceof Error ? e.message : "Upload failed"
    return Response.json({ error: message }, { status: 500 })
  }
}
