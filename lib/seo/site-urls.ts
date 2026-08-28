export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.link-jl.com";
export const staticRoutes = ["", "/products", "/solutions", "/about", "/contact", "/privacy-policy"] as const;

export function getVerifiedSameAs(value = process.env.NEXT_PUBLIC_ENTITY_PROFILES || ""): string[] {
  return value.split(",").map((item) => item.trim()).filter((item) => {
    try { return new URL(item).protocol === "https:"; } catch { return false; }
  });
}
