import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { company } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for the APEX website.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy Policy"
        title="Privacy Policy"
        description="How we handle business inquiries and website contact information."
      />
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8 leading-8 text-slate-600">
          <p>
            {company.name} collects business contact information submitted through website forms only for inquiry handling, technical communication and customer service.
          </p>
          <div>
            <h2 className="text-2xl font-black text-slate-950">Information We Collect</h2>
            <p className="mt-3">We may collect name, email address, company, country, message content and project requirements submitted by visitors.</p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">How We Use Information</h2>
            <p className="mt-3">Information is used to respond to inquiries, recommend suitable EV charging test solutions and provide technical or commercial follow-up.</p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">Data Sharing</h2>
            <p className="mt-3">We do not sell personal information. Information may be shared internally or with service partners only when necessary to support a customer request.</p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">Contact</h2>
            <p className="mt-3">For privacy questions, contact {company.email}.</p>
          </div>
        </div>
      </section>
    </>
  );
}
