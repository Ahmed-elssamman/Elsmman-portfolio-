import { NextRequest, NextResponse } from "next/server";
import { readResource, writeResource } from "@/lib/data";
import {
  RESOURCE_NAMES,
  type ResourceName,
} from "@/lib/data-schemas";
import { ZodError } from "zod";

export const runtime = "nodejs";

function isResource(name: string): name is ResourceName {
  return (RESOURCE_NAMES as string[]).includes(name);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { resource: string } }
) {
  if (!isResource(params.resource)) {
    return NextResponse.json({ error: "unknown_resource" }, { status: 404 });
  }
  try {
    const data = await readResource(params.resource);
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { error: "read_failed", detail: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { resource: string } }
) {
  if (!isResource(params.resource)) {
    return NextResponse.json({ error: "unknown_resource" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  try {
    const data = await writeResource(params.resource, body);
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "validation_failed", issues: err.issues },
        { status: 422 }
      );
    }
    return NextResponse.json(
      { error: "write_failed", detail: (err as Error).message },
      { status: 500 }
    );
  }
}
