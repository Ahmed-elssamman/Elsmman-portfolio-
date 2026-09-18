import { hasValidOrigin } from "@/lib/request-origin";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

interface ImageUploadResponse {
  ok: boolean;
  image?: string;
  error?: string;
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_REQUEST_BYTES = MAX_IMAGE_BYTES + 64 * 1024;

function isSupportedImage(buffer: Buffer): boolean {
  const png = buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const jpeg = buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255;
  const webp = buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  return png || jpeg || webp;
}

export async function POST(request: NextRequest): Promise<NextResponse<ImageUploadResponse>> {
  if (!hasValidOrigin(request)) {
    return NextResponse.json({ ok: false, error: "This upload must come from your portfolio editor." }, { status: 403 });
  }
  if (process.env.VERCEL) {
    return NextResponse.json({ ok: false, error: "This host does not keep uploaded files. Run the editor locally, then deploy the updated public and data folders." }, { status: 409 });
  }
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ ok: false, error: "Choose an image smaller than 5 MB." }, { status: 413 });
  }

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ ok: false, error: "Choose a PNG, JPEG, or WebP image." }, { status: 400 });
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ ok: false, error: "Choose an image smaller than 5 MB." }, { status: 413 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!isSupportedImage(buffer)) {
      return NextResponse.json({ ok: false, error: "Only PNG, JPEG, and WebP images are supported." }, { status: 415 });
    }

    let image: Buffer;
    try {
      image = await sharp(buffer, { limitInputPixels: 20_000_000 })
        .rotate()
        .resize(1440, 1000, { fit: "contain", background: "#ffffff" })
        .webp({ quality: 82 })
        .toBuffer();
    } catch {
      return NextResponse.json({ ok: false, error: "This image could not be opened. Try a smaller PNG, JPEG, or WebP file." }, { status: 422 });
    }

    const filename = `${randomUUID()}.webp`;
    const directory = path.join(process.cwd(), "public", "images", "projects");
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, filename), image, { flag: "wx" });
    return NextResponse.json({ ok: true, image: `/images/projects/${filename}` });
  } catch {
    return NextResponse.json({ ok: false, error: "The upload could not be saved. Check that this host allows files to be written, or use the local editor." }, { status: 500 });
  }
}
