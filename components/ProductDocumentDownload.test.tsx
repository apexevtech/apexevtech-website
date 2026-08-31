import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductDocumentDownload } from "@/components/ProductDocumentDownload";

describe("ProductDocumentDownload", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("downloads the product document and tracks the catalog conversion", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    const link = ProductDocumentDownload({
      href: "/product-documents/ST-HCDC-HPC.docx",
      model: "ST-HCDC-HPC",
    });

    expect(link.props.href).toBe("/product-documents/ST-HCDC-HPC.docx");
    expect(link.props.download).toBe("");

    link.props.onClick();

    expect(gtag).toHaveBeenCalledWith("event", "catalog_download", {
      location: "product-detail",
      model: "ST-HCDC-HPC",
    });
  });
});
