import { T } from "@/components/LanguageProvider";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { company } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy, Cookies & Analytics Policy",
  description: "Learn how APEX handles business inquiry data, website analytics and cookies, including the information collected, service providers, retention and your choices.",
  path: "/privacy-policy",
});

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
          <p className="text-sm font-semibold text-slate-500"><T>{"Last updated: 21 August 2026"}</T></p>
          <p><T>{"This website is operated by "}</T><T>{company.name}</T><T>{" (“APEX”, “we”, “us”). It is intended for business customers, engineering teams and organizations evaluating EV charging test equipment."}</T></p>
          <div>
            <h2 className="text-2xl font-black text-slate-950"><T>{"Information We Collect"}</T></h2>
            <p className="mt-3"><T>{"When you submit an inquiry, we may collect your name, business email, phone number, company, country, message and the product or solution you are asking about. We also receive basic technical information required to operate and secure the website."}</T></p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950"><T>{"How We Use Information"}</T></h2>
            <p className="mt-3"><T>{"We use inquiry information to respond to your request, recommend a suitable test system, provide technical or commercial follow-up, maintain records of business communication and protect the website from abuse."}</T></p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950"><T>{"Analytics and Cookies"}</T></h2>
            <p className="mt-3"><T>{"Optional Google Analytics is loaded only after you choose “Accept analytics” in the cookie notice. If you decline, analytics is not loaded. Essential browser storage may be used to remember your choice. You can review that choice at any time."}</T></p>
            <div className="mt-4"><CookieSettingsButton /></div>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950"><T>{"Service Providers and Retention"}</T></h2>
            <p className="mt-3"><T>{"We may use service providers such as our email delivery provider to process an inquiry on our behalf. We do not sell personal information. We retain inquiry information only for as long as reasonably necessary for customer communication, business records, legal obligations and dispute resolution."}</T></p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950"><T>{"Your Choices and Rights"}</T></h2>
            <p className="mt-3"><T>{"You may ask us to access, correct or delete personal information submitted through this website, or object to optional analytics. Contact us at "}</T><a className="font-bold text-[#1268a8] underline" href={`mailto:${company.email}`}><T>{company.email}</T></a><T>{". Depending on your location, local privacy law may provide additional rights."}</T></p>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-950"><T>{"Contact"}</T></h2>
            <p className="mt-3"><T>{company.name}</T>, <T>{company.location}</T><T>{". Email: "}</T><a className="font-bold text-[#1268a8] underline" href={`mailto:${company.email}`}><T>{company.email}</T></a>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
