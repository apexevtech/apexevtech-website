import { NextResponse } from "next/server";

export function GET(request: Request) {
  const url = new URL(request.url);
  const params = new URLSearchParams(url.searchParams);
  params.set("section", "resources");
  return NextResponse.redirect(new URL(`/project-cases?${params.toString()}`, url), 308);
}
