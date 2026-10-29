import { NextResponse } from "next/server";
import { GET as englishRedirect } from "@/app/library/route";
import { localizeHref } from "@/lib/i18n/urls";

export function GET(request: Request) {
  const response = englishRedirect(request);
  const destination = new URL(response.headers.get("location")!);
  destination.pathname = localizeHref(destination.pathname, "zh");
  return NextResponse.redirect(destination, response.status);
}
