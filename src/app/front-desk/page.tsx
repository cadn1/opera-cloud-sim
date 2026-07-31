"use client";

import { useState } from "react";
import { usePMS } from "@/lib/store";
import StatusPill from "@/components/StatusPill";

export default function FrontDeskPage() {
  const businessDate = usePMS((s) => s.businessDate);
  const reservations = usePMS((s) => s.reservations);
  const rooms = usePMS((s) => s.rooms);
  const checkIn = usePMS((s) => s.checkIn);
  const checkOut = usePMS((s) => s.checkOut);

  const [assign, setAssign] = useState<Record<string, string>>({});

  const arrivals = reservations.filter((r) => r.status === "Reserved" && r.arrival <= businessDate);
  const inHouse = reservations.filter((r) => r.status === "In House");

  function handleCheckIn(conf: string) {
    const roomNumber = assign[conf];
    if (!roomNumber) {
      alert("Asigná una habitación antes de hacer check-in.");
      return;
    }
    checkIn(conf, roomNumber);
  }

  function handleCheckOut(conf: string) {
    const result = checkOut(conf);
    if (!result.ok) return;
    if (result.balance !== 0) {
      // El check-out ya se ejecutó en el store; esto es solo informativo,
      // igual que en Opera Cloud, donde se advierte pero se permite forzar el check-out.
      alert(`Check-out realizado. El folio quedó con saldo de $${result.balance.toLocaleString("es-CL")}.`);
    }
  }

  return (
    <>
      <div className="mb-3 rounded border border-[#f0dfa0] bg-[#fff9e6] px-3 py-2 text-xs text-[#7a5c00]">
        Front Desk trabaja siempre sobre la fecha de negocio actual (<b>{businessDate}</b>). Solo se
        puede hacer check-in de reservas con llegada en o antes de hoy, y check-out de huéspedes
        in-house.
      </div>

      <div className="panel">
        <div className="panel-header">
          <span>Llegadas pendientes (Check-In)</span>
          <span>{arrivals.length}</span>
        </div>
        <div className="panel-body !p-0">
          {arrivals.length === 0 ? (
            <div className="p-5 text-center italic text-muted">No hay llegadas pendientes.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Conf.</th>
                  <th>Huésped</th>
                  <th>Llegada</th>
                  <th>Tipo Hab.</th>
                  <th>Asignar habitación</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {arrivals.map((r) => {
                  const freeRooms = rooms.filter((rm) => rm.status === "VC" && rm.type === r.roomType);
                  return (
                    <tr key={r.conf}>
                      <td>{r.conf}</td>
                      <td>{r.guestName}</td>
                      <td>{r.arrival}</td>
                      <td>{r.roomType}</td>
                      <td>
                        <select
                          className="field-input"
                          value={assign[r.conf] ?? ""}
                          onChange={(e) => setAssign({ ...assign, [r.conf]: e.target.value })}
                        >
                          <option value="">-- Elegir habitación libre --</option>
                          {freeRooms.map((rm) => (
                            <option key={rm.number} value={rm.number}>
                              {rm.number} ({rm.type})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn-primary px-3 py-1 text-[11.5px]"
                          onClick={() => handleCheckIn(r.conf)}
                        >
                          Check-In
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span>Huéspedes In-House</span>
          <span>{inHouse.length}</span>
        </div>
        <div className="panel-body !p-0">
          {inHouse.length === 0 ? (
            <div className="p-5 text-center italic text-muted">No hay huéspedes alojados.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Conf.</th>
                  <th>Huésped</th>
                  <th>Habitación</th>
                  <th>Salida</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {inHouse.map((r) => (
                  <tr key={r.conf}>
                    <td>{r.conf}</td>
                    <td>{r.guestName}</td>
                    <td className="font-bold">{r.room}</td>
                    <td>{r.departure}</td>
                    <td>
                      <button
                        className="btn-secondary px-3 py-1 text-[11.5px]"
                        onClick={() => handleCheckOut(r.conf)}
                      >
                        Check-Out
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
