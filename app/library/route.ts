import { NextResponse } from "next/server";
import { getLibraryResourceHref } from "@/lib/navigation/library-resource-redirect";

export function GET(request: Request) {
  const url = new URL(request.url);
  return NextResponse.redirect(new URL(getLibraryResourceHref(url.searchParams), url), 308);
}
