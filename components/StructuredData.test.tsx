import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LanguageProvider } from "@/components/LanguageProvider";
import { messages } from "@/lib/i18n/zh";
import { StructuredData } from "./StructuredData";

describe("localized JSON-LD rendering", () => {
  it("renders Chinese JSON-LD on the first server render", () => {
    const html = renderToStaticMarkup(<LanguageProvider initialLanguage="zh" initialMessages={messages}><StructuredData data={{ "@type": "Article", headline: "EV charging protocol diagnosis", url: "/resources/ev-charging-protocol-testing", inLanguage: "en" }} /></LanguageProvider>);
    const data = JSON.parse(html.match(/<script[^>]*>(.*?)<\/script>/)![1]);
    expect(data.headline).toBe("充电协议诊断");
    expect(data.url).toBe("/zh/resources/ev-charging-protocol-testing");
    expect(data.inLanguage).toBe("zh-Hans");
  });

  it("keeps English data and escapes script-breaking content", () => {
    const html = renderToStaticMarkup(<StructuredData data={{ "@type": "Article", headline: "</script><script>alert(1)</script>" }} />);
    expect(html.match(/<script/g)).toHaveLength(1);
    expect(html).toContain("\\u003c/script>");
    expect(JSON.parse(html.match(/<script[^>]*>(.*?)<\/script>/)![1]).headline).toBe("</script><script>alert(1)</script>");
  });
});
