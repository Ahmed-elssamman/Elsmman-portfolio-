import { hasValidOrigin } from "@/lib/request-origin";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readResource, writeResource } from "@/lib/data";
import {
  RESOURCE_NAMES,
  type ResourceName,
  type SiteData,
} from "@/lib/data-schemas";
import { ZodError } from "zod";

export const runtime = "nodejs";

interface ResourceRouteParameters {
  resource: string;
}
interface ResourceRouteContext {
  params: Promise<ResourceRouteParameters>;
}
interface ResourceResponse {
  ok?: boolean;
  data?: SiteData[ResourceName];
  error?: string;
  detail?: string;
  issues?: { path: string[]; message: string }[];
}

function isResource(name: string): name is ResourceName {
  return RESOURCE_NAMES.some((resource) => resource === name);
}

export async function GET(
  _request: NextRequest,
  { params }: ResourceRouteContext,
): Promise<NextResponse<ResourceResponse>> {
  const { resource } = await params;
  if (!isResource(resource))
    return NextResponse.json({ error: "unknown_resource" }, { status: 404 });
  try {
    const data = await readResource(resource);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      {
        error: "read_failed",
        detail: "Content could not be loaded. Please try again.",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: ResourceRouteContext,
): Promise<NextResponse<ResourceResponse>> {
  const { resource } = await params;
  if (!isResource(resource))
    return NextResponse.json({ error: "unknown_resource" }, { status: 404 });
  if (!hasValidOrigin(request)) {
    return NextResponse.json(
      {
        error: "invalid_origin",
        detail: "Save changes from your portfolio editor.",
      },
      { status: 403 },
    );
  }
  if (process.env.VERCEL) {
    return NextResponse.json(
      {
        error: "storage_unavailable",
        detail:
          "This host cannot keep edits. Run the editor locally, then deploy your updated data and public folders.",
      },
      { status: 409 },
    );
  }
  let body: SiteData[ResourceName];
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  try {
    const data = await writeResource(resource, body);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "validation_failed",
          issues: error.issues.map((issue) => ({
            path: issue.path.map(String),
            message: issue.message,
          })),
        },
        { status: 422 },
      );
    }
    return NextResponse.json(
      {
        error: "write_failed",
        detail:
          "Changes could not be saved. Check that this host allows file edits, or use the local editor.",
      },
      { status: 500 },
    );
  }
}
