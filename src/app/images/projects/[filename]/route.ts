import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

interface ImageRouteContext {
  params: Promise<{ filename: string }>;
}

export async function GET(_request: Request, { params }: ImageRouteContext): Promise<Response> {
  const { filename } = await params;
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.webp$/.test(filename)) {
    return new Response(null, { status: 404 });
  }
  try {
    const image = await readFile(path.join(process.cwd(), "public", "images", "projects", filename));
    return new Response(new Uint8Array(image), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
