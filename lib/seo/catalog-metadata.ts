export const libraryIndexTitle = "EV Testing Technical Library: Solutions & Application Planning";
export const resourceIndexTitle = "EV Charger Test Equipment & Testing Guides";

export function getCatalogMetadataState(path: string, title: string, page: number, filtered: boolean) {
  return {
    title: !filtered && page > 1 ? `${title} - Page ${page}` : title,
    path: !filtered && page > 1 ? `${path}?page=${page}` : path,
  };
}
