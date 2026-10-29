import type { Metadata } from "next";
import { localizedPagePaths } from "@/lib/i18n/public-pages";
import { getPublicPageMetadata, renderPublicPage, type PublicPageSearchParams } from "@/lib/i18n/page-dispatch";

type Props = {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<PublicPageSearchParams>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return localizedPagePaths.map((path) => ({ path: path === "/" ? [] : path.slice(1).split("/") }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { path } = await params;
  return getPublicPageMetadata(`/${path?.join("/") ?? ""}`, "zh", searchParams);
}

export default async function ChinesePage({ params, searchParams }: Props) {
  const { path } = await params;
  return renderPublicPage(`/${path?.join("/") ?? ""}`, searchParams);
}
