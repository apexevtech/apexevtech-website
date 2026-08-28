import type { Metadata } from "next";
import { ResourceCard } from "@/components/ResourceCard";
import { resources } from "@/lib/resources/catalog";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "EV Charging Test Resources", description: "Practical guides for selecting, configuring and using EV charger testing equipment.", alternates: { canonical: "/resources" } };

export default function ResourcesPage() {
  return <><PageHero eyebrow="Resources" title="Practical guidance for EV charger validation." description="Use these technical guides to define a test scope, compare equipment and prepare a more useful inquiry." /><main className="mx-auto max-w-7xl px-5 py-14 lg:px-8"><div className="grid gap-x-12 md:grid-cols-2">{resources.map((resource) => <ResourceCard key={resource.slug} resource={resource} />)}</div></main></>;
}
