"use client";

import { Suspense } from "react";
import SearchContent from "./SearchContent";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}

