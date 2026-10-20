export const catalogPageSize = 6;

export function parsePageNumber(value: string | null): number {
  if (!value || !/^\d+$/.test(value)) return 1;
  const page = Number(value);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export function paginate<T>(entries: readonly T[], requestedPage: number, pageSize = catalogPageSize) {
  const size = Number.isSafeInteger(pageSize) && pageSize > 0 ? pageSize : catalogPageSize;
  const totalPages = Math.max(1, Math.ceil(entries.length / size));
  const page = Math.min(totalPages, parsePageNumber(String(requestedPage)));
  const offset = (page - 1) * size;
  return {
    items: entries.slice(offset, offset + size),
    page,
    totalPages,
    totalItems: entries.length,
    start: entries.length ? offset + 1 : 0,
    end: Math.min(offset + size, entries.length),
  };
}

export function buildPageHref(path: string, existing: URLSearchParams, page: number, anchor: string) {
  const params = new URLSearchParams(existing);
  if (page > 1) params.set("page", String(page));
  else params.delete("page");
  const query = params.toString();
  return `${path}${query ? `?${query}` : ""}${anchor ? `#${anchor}` : ""}`;
}

export function searchParamsFromRecord(record: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(record)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (first !== undefined) params.set(key, first);
  }
  return params;
}
