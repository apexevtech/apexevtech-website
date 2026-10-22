import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ProductDocumentDownload } from "@/components/ProductDocumentDownload";

describe("ProductDocumentDownload", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("downloads the product document and tracks the catalog conversion", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    const link = ProductDocumentDownload({
      href: "/downloads/st-hcdc-hpc-specifications.docx",
      model: "ST-HCDC-HPC",
    });

    expect(link.props.href).toBe("/downloads/st-hcdc-hpc-specifications.docx");
    expect(link.props.download).toBe("");
    const html = renderToStaticMarkup(link);
    expect(html).toContain("lucide-download");
    expect(html).toContain("min-h-11 max-w-full items-center gap-2");
    expect(html).toContain("Download original specifications (Word)");

    link.props.onClick();

    expect(gtag).toHaveBeenCalledWith("event", "catalog_download", {
      location: "product-detail",
      model: "ST-HCDC-HPC",
    });
  });
});
