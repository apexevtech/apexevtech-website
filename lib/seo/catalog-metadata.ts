export const libraryIndexTitle = "EV Testing Technical Library: Solutions & Application Planning";
export const resourceIndexTitle = "EV Charger Test Equipment & Testing Guides";
export const projectCasesIndexTitle = "EV Charger Project Cases & Testing References";

export function getCatalogMetadataState(path: string, title: string, page: number, filtered: boolean) {
  const url = new URL(path, "https://catalog.invalid");
  if (!filtered && page > 1) url.searchParams.set("page", String(page));
  return {
    title: !filtered && page > 1 ? `${title} - Page ${page}` : title,
    path: `${url.pathname}${url.search}`,
  };
}
