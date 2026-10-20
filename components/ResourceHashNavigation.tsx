"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { decodeResourceHash, resolveResourceHash } from "@/lib/navigation/resource-hash";
import { serializeResourceBrowserFilters, type ResourceBrowserFilters } from "@/lib/resources/browser";

function revealTarget(target: HTMLElement) {
  let ancestor = target.parentElement;
  while (ancestor) {
    if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
    ancestor = ancestor.parentElement;
  }
  target.scrollIntoView({ block: "start" });
}

export function ResourceHashNavigation({ filters }: { filters: ResourceBrowserFilters }) {
  const router = useRouter();
  const currentFilters = useRef(filters);
  const currentRouter = useRef(router);
  const handledHash = useRef<string | null>(null);
  const pendingHash = useRef<string | null>(null);
  const pendingFilters = useRef<ResourceBrowserFilters | null>(null);

  useEffect(() => {
    currentFilters.current = filters;
    currentRouter.current = router;
  }, [filters, router]);

  useEffect(() => {
    const navigateHash = () => {
      const hash = window.location.hash;
      if (handledHash.current === hash) return;
      handledHash.current = hash;
      pendingHash.current = null;
      pendingFilters.current = null;
      const id = decodeResourceHash(hash);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        revealTarget(target);
        return;
      }
      const destination = resolveResourceHash(hash, currentFilters.current);
      if (!destination || destination.page === currentFilters.current.page) return;

      // The URL changes first; wait for the catalog to render the destination page.
      const next = { ...currentFilters.current, page: destination.page };
      pendingHash.current = hash;
      pendingFilters.current = next;
      const url = new URL(window.location.href);
      url.search = serializeResourceBrowserFilters(next, url.searchParams).toString();
      currentRouter.current.replace(`${url.pathname}${url.search}${hash}`, { scroll: false });
    };

    const frame = window.requestAnimationFrame(navigateHash);
    window.addEventListener("hashchange", navigateHash);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", navigateHash);
    };
  }, []);

  useEffect(() => {
    const hash = pendingHash.current;
    const expected = pendingFilters.current;
    if (!hash || !expected) return;
    if (window.location.hash !== hash || filters.type !== expected.type || filters.category !== expected.category || filters.query.trim() !== expected.query.trim()) {
      pendingHash.current = null;
      pendingFilters.current = null;
      return;
    }
    if (filters.page !== expected.page) return;
    const frame = window.requestAnimationFrame(() => {
      if (pendingHash.current !== hash || window.location.hash !== hash) return;
      const id = decodeResourceHash(hash);
      const target = id ? document.getElementById(id) : null;
      if (target) revealTarget(target);
      pendingHash.current = null;
      pendingFilters.current = null;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [filters]);

  return null;
}
