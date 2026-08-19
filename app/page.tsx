import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/site";

const challenges = [
  ["Custom standards and interfaces?", "We map connector standards, communication protocols, voltage ranges and test objectives into a complete system specification."],
  ["Complex validation workflows?", "Bring interoperability, metering, safety simulation and waveform analysis into one repeatable field or laboratory workflow."],
  ["Compliance and traceability concerns?", "Test against the standards that matter to your market with clear reports, captured messages and reproducible test conditions."],
  ["Global deployment and support?", "Configure systems for local charging standards and rely on remote technical support throughout commissioning and operation."],
];

const process = [
  ["Requirement Review", "We begin with your charger type, target market, standards, voltage and current range, and required test coverage."],
  ["System Configuration", "Our engineers select the tester, interfaces, metering options and software functions needed for the application."],
  ["Delivery & Support", "Equipment is verified before delivery, followed by documentation, onboarding and responsive technical support."],
];

const questions = [
  ["Can one system test both AC and DC chargers?", "AC and DC charging use different interfaces and test workflows. We configure the correct equipment set and can combine both into one project package."],
  ["Which charging standards do you support?", "Our portfolio covers major GB/T, IEC, SAE J1772 and NACS applications. Exact support depends on the selected model and configuration."],
  ["Can the equipment be used in the field?", "Yes. Portable models use rugged protective enclosures and are designed for commissioning, maintenance and troubleshooting at charging sites."],
  ["Do you support custom test requirements?", "Yes. Share your test plan, charger specification or target standard and our engineering team will review the required hardware and software scope."],
];

export default function HomePage() {
  return (
    <main>
      <section className="bg-[#1a2332] text-white">
        <div className="mx-auto grid min-h-[640px] max-w-[1440px] items-center gap-12 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#f58220]">EVSE Test &amp; Validation</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.08] md:text-5xl lg:text-[4.25rem]">
              Test with confidence. <span className="text-[#f58220]">Launch with proof.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-gray-200 md:text-xl">
              Integrated AC and DC charger test systems for manufacturers, laboratories and field teams. Validate protocols, metering, safety and interoperability with repeatable results your customers can trust.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-md bg-[#f58220] px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-[#d96f10]">
                Discuss Your Test Plan <span aria-hidden="true">→</span>
              </Link>
              <Link href="/products" className="inline-flex items-center rounded-md border border-gray-500 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10">
                Explore Systems
              </Link>
            </div>
            <div className="mt-12 grid max-w-xl grid-cols-3 gap-5 border-t border-white/15 pt-6">
              {[['10+ yrs', 'Industry Experience'], ['24-48 hr', 'Project Response'], ['Global', 'Technical Support']].map(([value, label]) => (
                <div key={label}>
                  <div className="text-xl font-bold text-[#f58220] md:text-2xl">{value}</div>
                  <div className="mt-1 text-xs leading-5 text-gray-300 md:text-sm">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border-8 border-white/90 bg-white shadow-2xl shadow-black/25">
            <Image
              src="/assets/hero/test-lab-systems.jpg"
              alt="Integrated EV charger test laboratory systems"
              fill
              priority
              sizes="(min-width: 1440px) 760px, (min-width: 1024px) 54vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-[#1a2332] md:text-4xl">Sound Familiar?</h2>
            <p className="mt-4 text-lg text-gray-600">These are the recurring challenges teams face when validating EV charging equipment.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {challenges.map(([title, description], index) => (
              <article key={title} className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1a2332]/10 font-bold text-[#1a2332]">0{index + 1}</div>
                <h3 className="mt-4 text-lg font-semibold text-[#1a2332]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#1a2332] py-14 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-9 text-center">
            <p className="text-xs font-semibold uppercase text-[#f58220]">How We Work</p>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">Engineering-Led Testing Solutions Built Around Your Application</h2>
          </div>
          <div className="grid gap-8 text-center md:grid-cols-3">
            {process.map(([title, description]) => (
              <div key={title}>
                <h3 className="text-xl font-bold text-[#f58220] md:text-2xl">{title}</h3>
                <p className="mt-3 leading-7 text-gray-200">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-[#1a2332] md:text-4xl">Core Testing Systems</h2>
              <p className="mt-3 text-lg text-gray-600">Purpose-built equipment for production, laboratory and field validation.</p>
            </div>
            <Link href="/products" className="font-medium text-[#1a2332] transition-colors hover:text-[#f58220]">View All Products →</Link>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}`} className="group overflow-hidden rounded-lg border border-gray-100 transition-shadow hover:shadow-lg">
                <div className="relative aspect-[16/10] bg-[#edf1f4]">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={`${product.model} EV charger tester`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-contain p-5"
                    />
                  )}
                </div>
                <div className="p-6">
                  <span className="inline-block rounded bg-[#1a2332]/10 px-2 py-1 text-xs font-medium text-[#1a2332]">{product.category}</span>
                  <h3 className="mt-3 text-lg font-semibold text-[#1a2332] transition-colors group-hover:text-[#f58220]">{product.model}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">{product.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f8fafc] py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase text-[#f58220]">What Buyers Ask First</p>
            <h2 className="mt-3 text-3xl font-bold text-[#1a2332] md:text-4xl">Questions Engineering &amp; Procurement Teams Always Ask</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {questions.map(([question, answer]) => (
              <article key={question} className="rounded-lg border border-gray-200 bg-white p-6">
                <h3 className="font-semibold text-[#1a2332]">“{question}”</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#1a2332] md:text-4xl">Ready to Start Your EV Charger Testing Project?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-7 text-gray-600">Tell us your charger type, standards, voltage range and test goals. Our engineering team will recommend a suitable system configuration.</p>
          <Link href="/contact" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#f58220] px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-[#d96f10]">
            Submit Your Project Brief <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
