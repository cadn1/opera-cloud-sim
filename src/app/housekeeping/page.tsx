"use client";

import { usePMS } from "@/lib/store";
import { ROOM_STATUS_LABELS, RoomStatus } from "@/lib/types";
import StatusPill from "@/components/StatusPill";

const cycle: Record<RoomStatus, RoomStatus> = {
  VC: "VD",
  VD: "VC",
  OCC: "OCC",
  OO: "VC",
};

export default function HousekeepingPage() {
  const rooms = usePMS((s) => s.rooms);
  const setRoomStatus = usePMS((s) => s.setRoomStatus);

  const counts = rooms.reduce(
    (acc, r) => ({ ...acc, [r.status]: (acc[r.status] ?? 0) + 1 }),
    {} as Record<RoomStatus, number>
  );

  function toggle(number: string, status: RoomStatus) {
    if (status === "OCC") {
      alert("La habitación está ocupada. Se libera automáticamente al hacer Check-Out.");
      return;
    }
    setRoomStatus(number, cycle[status]);
  }

  return (
    <>
      <div className="mb-3 rounded border border-[#f0dfa0] bg-[#fff9e6] px-3 py-2 text-xs text-[#7a5c00]">
        Hacé clic en una habitación para cambiar su estado (Vacía Sucia ⇄ Vacía Limpia). Las
        habitaciones Ocupadas se liberan automáticamente al hacer Check-Out en Front Desk.
      </div>

      <div className="panel">
        <div className="panel-header">
          <span>Estado de habitaciones</span>
          <span>
            VC: {counts.VC ?? 0} · VD: {counts.VD ?? 0} · OCC: {counts.OCC ?? 0} · OO: {counts.OO ?? 0}
          </span>
        </div>
        <div className="panel-body">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {rooms.map((r) => (
              <div
                key={r.number}
                onClick={() => toggle(r.number, r.status)}
                className="cursor-pointer rounded border border-border bg-[#fafcfd] p-2"
              >
                <div className="text-sm font-bold text-navy-dark">{r.number}</div>
                <div className="mb-1.5 text-[10.5px] text-muted">{r.type}</div>
                <StatusPill status={r.status} label={ROOM_STATUS_LABELS[r.status]} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
