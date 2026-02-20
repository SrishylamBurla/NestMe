"use client";

import { Suspense } from "react";
import PropertiesContent from "./PropertiesContent";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10">Loading properties...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}







// export const dynamic = "force-dynamic";
