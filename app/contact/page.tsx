import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { company } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact APEX for EV charger testing equipment inquiries and technical solution support.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Get a quote for EV charging test equipment."
        description="Send your application, standards, voltage/current range and target workflow. Our team will respond with suitable APEX test solutions."
      />
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-md bg-[#102a43] p-8 text-white">
            <h2 className="text-3xl font-black">APEX Contact</h2>
            <div className="mt-6 grid gap-4 text-slate-300">
              <p>{company.name}</p>
              <p>{company.location}</p>
              <a href={`mailto:${company.email}`} className="text-white hover:text-sky-300">
                {company.email}
              </a>
              <a href={`tel:${company.phone.replaceAll(" ", "")}`} className="text-white hover:text-sky-300">
                {company.phone}
              </a>
            </div>
          </div>
          <InquiryForm />
        </div>
      </section>
    </>
  );
}
