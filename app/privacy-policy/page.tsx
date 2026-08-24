import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { company } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy and analytics policy for the APEX EV charger testing website.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy Policy"
        title="How APEX handles website information."
        description="This policy explains what we collect through business inquiries, why we use it and how you can contact us about your information."
      />
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8 leading-8 text-slate-600">
          <p className="text-sm font-semibold text-slate-500">Last updated: 21 August 2026</p>
          <p>
            This website is operated by {company.name} ("APEX", "we", "us"). It is intended for business customers, engineering teams and organizations evaluating EV charging test equipment.
          </p>
          <div>
            <h2 className="text-2xl font-black text-slate-950">Information We Collect</h2>
            <p className="mt-3">When you submit an inquiry, we may collect your name, business email, phone number, company, country, message and the product or solution you are asking about. We also receive basic technical information required to operate and secure the website.</p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">How We Use Information</h2>
            <p className="mt-3">We use inquiry information to respond to your request, recommend a suitable test system, provide technical or commercial follow-up, maintain records of business communication and protect the website from abuse.</p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">Analytics and Cookies</h2>
            <p className="mt-3">Optional Google Analytics is loaded only after you choose “Accept analytics” in the cookie notice. If you decline, analytics is not loaded. Essential browser storage may be used to remember your choice. You can review that choice at any time.</p>
            <div className="mt-4"><CookieSettingsButton /></div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">Service Providers and Retention</h2>
            <p className="mt-3">We may use service providers such as our email delivery provider to process an inquiry on our behalf. We do not sell personal information. We retain inquiry information only for as long as reasonably necessary for customer communication, business records, legal obligations and dispute resolution.</p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">Your Choices and Rights</h2>
            <p className="mt-3">You may ask us to access, correct or delete personal information submitted through this website, or object to optional analytics. Contact us at <a className="font-bold text-[#1479c9] underline" href={`mailto:${company.email}`}>{company.email}</a>. Depending on your location, local privacy law may provide additional rights.</p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950">Contact</h2>
            <p className="mt-3">{company.name}, {company.location}. Email: <a className="font-bold text-[#1479c9] underline" href={`mailto:${company.email}`}>{company.email}</a>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
