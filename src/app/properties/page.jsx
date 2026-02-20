// "use client";
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useGetPropertiesQuery } from "@/store/services/PropertiesApi";
import { LoadingGrid, EmptyState, ErrorState } from "@/components/LoadingGrid";
import PropertiesGrid from "@/components/PropertiesGrid";
import Link from "next/link";

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






