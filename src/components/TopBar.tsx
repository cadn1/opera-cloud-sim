"use client";

import { usePMS } from "@/lib/store";

export default function TopBar() {
  const businessDate = usePMS((s) => s.businessDate);
  const advanceBusinessDate = usePMS((s) => s.advanceBusinessDate);

  return (
    <div className="flex items-center justify-between border-b-[3px] border-blue bg-navy px-4 py-1.5 text-white">
      <div className="text-sm font-bold tracking-wide">
        OPERA <span className="text-blue-light/80">CLOUD</span>{" "}
        <span className="font-normal text-white/60">— Simulador de práctica</span>
      </div>
      <div className="flex items-center gap-5 text-xs text-white/80">
        <span>
          Propiedad: <b className="text-white">HOTEL DEMO SANTIAGO</b>
        </span>
        <span>
          Fecha de negocio: <b className="text-white">{businessDate}</b>
        </span>
        <button
          onClick={advanceBusinessDate}
          className="rounded border border-white/30 px-2 py-0.5 text-[11px] hover:bg-white/10"
          title="Simula el proceso de Night Audit avanzando un día"
        >
          Avanzar día (Night Audit)
        </button>
        <span>
          Usuario: <b className="text-white">TRAINING</b>
        </span>
      </div>
    </div>
  );
}
