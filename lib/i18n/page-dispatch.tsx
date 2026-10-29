import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import HomePage, { metadata as homeMetadata } from "@/app/(en)/page";
import ProductsPage, { metadata as productsMetadata } from "@/app/(en)/products/page";
import SolutionsPage, { metadata as solutionsMetadata } from "@/app/(en)/solutions/page";
import InterfacesPage, { metadata as interfacesMetadata } from "@/app/(en)/interfaces/page";
import AboutPage, { metadata as aboutMetadata } from "@/app/(en)/about/page";
import ContactPage, { metadata as contactMetadata } from "@/app/(en)/contact/page";
import PrivacyPolicyPage, { metadata as privacyMetadata } from "@/app/(en)/privacy-policy/page";
import ProjectCasesPage, { generateMetadata as projectCasesMetadata } from "@/app/(en)/project-cases/page";
import ProductDetailPage, { generateMetadata as productMetadata } from "@/app/(en)/products/[slug]/page";
import ResourcePage, { generateMetadata as resourceMetadata } from "@/app/(en)/resources/[slug]/page";
import ApplicationPage, { generateMetadata as applicationMetadata } from "@/app/(en)/applications/[slug]/page";
import InterfacePage, { generateMetadata as interfaceMetadata } from "@/app/(en)/interfaces/[slug]/page";
import ProjectBriefPage, { generateMetadata as projectBriefMetadata } from "@/app/(en)/project-cases/[slug]/page";
import { localizedPagePaths } from "@/lib/i18n/public-pages";
import type { Language } from "@/lib/i18n/preference";
import { localizePageMetadata } from "@/lib/seo/localized-metadata";

export type PublicPageSearchParams = Record<string, string | string[] | undefined>;
type SearchParamsPromise = Promise<PublicPageSearchParams>;
type SlugProps = { params: Promise<{ slug: string }> };
type StaticPage = { render: () => ReactNode; metadata: Metadata };
type DetailPage = { render: (props: SlugProps) => Promise<ReactNode>; metadata: (props: SlugProps) => Promise<Metadata> };

const publicPaths = new Set(localizedPagePaths);
const staticPages: Record<string, StaticPage> = {
  "/": { render: HomePage, metadata: homeMetadata },
  "/products": { render: ProductsPage, metadata: productsMetadata },
  "/solutions": { render: SolutionsPage, metadata: solutionsMetadata },
  "/interfaces": { render: InterfacesPage, metadata: interfacesMetadata },
  "/about": { render: AboutPage, metadata: aboutMetadata },
  "/contact": { render: ContactPage, metadata: contactMetadata },
  "/privacy-policy": { render: PrivacyPolicyPage, metadata: privacyMetadata },
};
const detailPages: Record<string, DetailPage> = {
  products: { render: ProductDetailPage, metadata: productMetadata },
  resources: { render: ResourcePage, metadata: resourceMetadata },
  applications: { render: ApplicationPage, metadata: applicationMetadata },
  interfaces: { render: InterfacePage, metadata: interfaceMetadata },
  "project-cases": { render: ProjectBriefPage, metadata: projectBriefMetadata },
};

function requirePublicPath(path: string) {
  if (!publicPaths.has(path)) notFound();
}

function getDetailPage(path: string) {
  const [, section, slug] = path.split("/");
  const page = detailPages[section];
  if (!page || !slug) notFound();
  return { page, props: { params: Promise.resolve({ slug }) } };
}

export async function renderPublicPage(path: string, searchParams?: SearchParamsPromise): Promise<ReactNode> {
  requirePublicPath(path);
  if (path === "/project-cases") return ProjectCasesPage({ searchParams: searchParams ?? Promise.resolve({}) });
  const staticPage = staticPages[path];
  if (staticPage) return staticPage.render();
  const { page, props } = getDetailPage(path);
  return page.render(props);
}

export async function getPublicPageMetadata(path: string, language: Language, searchParams?: SearchParamsPromise): Promise<Metadata> {
  requirePublicPath(path);
  let metadata: Metadata;
  if (path === "/project-cases") {
    metadata = await projectCasesMetadata({ searchParams: searchParams ?? Promise.resolve({}) });
  } else if (staticPages[path]) {
    metadata = staticPages[path].metadata;
  } else {
    const { page, props } = getDetailPage(path);
    metadata = await page.metadata(props);
  }
  return localizePageMetadata(metadata, language);
}
