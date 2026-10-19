"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

type QueryStateSyncProps = { onChange: (params: URLSearchParams) => void };

function QueryStateObserver({ onChange }: QueryStateSyncProps) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  useEffect(() => {
    onChange(new URLSearchParams(query));
  }, [query, onChange]);

  return null;
}

// Isolate URL-dependent rendering so the surrounding catalog remains prerendered.
export function QueryStateSync(props: QueryStateSyncProps) {
  return <Suspense fallback={null}><QueryStateObserver {...props} /></Suspense>;
}
