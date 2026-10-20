"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function CatalogControls({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const controls = ref.current;
    if (!controls) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(controls);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} data-floating-controls-visible={visible} className={className}>{children}</div>;
}
