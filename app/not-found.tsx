import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The requested APEX page could not be found. Browse EV charger test equipment, interface guides and engineering resources.",
};

const destinations = [
  { href: "/products", title: "Test equipment", description: "Compare AC, DC, portable and integrated EV charger test systems." },
  { href: "/interfaces", title: "Interface guides", description: "Plan testing for CCS2, CHAdeMO, GB/T, NACS, Type 1 and Type 2." },
  { href: "/resources", title: "Engineering resources", description: "Review equipment selection, protocol, commissioning and validation guides." },
];

export default function NotFound() {
  return (
    <section className="bg-[#f3f8fa] px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#1268a8]">404 · Page not found</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-[#12263a] md:text-5xl">The page may have moved or the address may be incomplete.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#526b7d]">Use one of the main technical sections below, or send the charger interface and test requirements to an APEX engineer.</p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {destinations.map((destination) => (
            <Link key={destination.href} href={destination.href} className="rounded-md border border-slate-200 bg-white p-6 transition hover:border-[#1479c9] hover:shadow-sm">
              <h2 className="text-xl font-black text-[#1268a8]">{destination.title} →</h2>
              <p className="mt-3 text-sm leading-6 text-[#526b7d]">{destination.description}</p>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/" className="inline-flex rounded-md border border-[#1479c9] bg-white px-6 py-3 font-black text-[#1268a8]">Return to homepage</Link>
          <Link href="/contact#inquiry-form" className="inline-flex rounded-md bg-[#1479c9] px-6 py-3 font-black text-white hover:bg-[#0f5f9f]">Talk to an engineer</Link>
        </div>
      </div>
    </section>
  );
}
