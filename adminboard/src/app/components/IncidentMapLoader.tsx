
"use client";

import dynamic from "next/dynamic";
import type { MapIncident } from "./IncidentMap";

const IncidentMap = dynamic(() => import("./IncidentMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[420px] items-center justify-center rounded-xl bg-slate-100 text-slate-500">
      Loading incident map...
    </div>
  ),
});

export default function IncidentMapLoader({
  incidents,
}: {
  incidents: MapIncident[];
}) {
  return <IncidentMap incidents={incidents} />;
}
