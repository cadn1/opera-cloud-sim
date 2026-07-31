"use client";

import { useState } from "react";
import { usePMS } from "@/lib/store";
import { RATE_LABELS, RateCode, ROOM_TYPE_LABELS, RoomType } from "@/lib/types";
import StatusPill from "@/components/StatusPill";

const roomTypes = Object.keys(ROOM_TYPE_LABELS) as RoomType[];
const rateCodes = Object.keys(RATE_LABELS) as RateCode[];

function today() {
  return new Date().toISOString().slice(0, 10);
}
function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export default function ReservationsPage() {
  const reservations = usePMS((s) => s.reservations);
  const createReservation = usePMS((s) => s.createReservation);

  const [guestName, setGuestName] = useState("");
  const [arrival, setArrival] = useState(today());
  const [departure, setDeparture] = useState(addDays(today(), 1));
  const [roomType, setRoomType] = useState<RoomType>("STD");
  const [rateCode, setRateCode] = useState<RateCode>("BAR");
  const [pax, setPax] = useState(1);

  function handleSubmit() {
    if (!guestName.trim()) {
      alert("Ingresá el nombre del huésped.");
      return;
    }
    if (departure <= arrival) {
      alert("La fecha de salida debe ser posterior a la de llegada.");
      return;
    }
    createReservation({ guestName: guestName.trim(), arrival, departure, roomType, rateCode, pax });
    setGuestName("");
  }

  return (
    <>
      <div className="panel">
        <div className="panel-header">Nueva reserva</div>
        <div className="panel-body">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            <div>
              <label className="field-label">Nombre huésped</label>
              <input
                className="field-input"
                placeholder="Apellido, Nombre"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Llegada</label>
              <input
                type="date"
                className="field-input"
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Salida</label>
              <input
                type="date"
                className="field-input"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Tipo de habitación</label>
              <select
                className="field-input"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as RoomType)}
              >
                {roomTypes.map((t) => (
                  <option key={t} value={t}>
                    {t} — {ROOM_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Código de tarifa</label>
              <select
                className="field-input"
                value={rateCode}
                onChange={(e) => setRateCode(e.target.value as RateCode)}
              >
                {rateCodes.map((r) => (
                  <option key={r} value={r}>
                    {r} — {RATE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Pax</label>
              <input
                type="number"
                min={1}
                className="field-input"
                value={pax}
                onChange={(e) => setPax(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
          <div className="mt-3">
            <button className="btn-primary" onClick={handleSubmit}>
              Crear reserva
            </button>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span>Reservas activas</span>
          <span>{reservations.filter((r) => r.status !== "Checked Out").length} reservas</span>
        </div>
        <div className="panel-body !p-0">
          {reservations.length === 0 ? (
            <div className="p-5 text-center italic text-muted">
              Sin reservas. Creá una arriba para empezar a practicar.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>N° Conf.</th>
                  <th>Huésped</th>
                  <th>Llegada</th>
                  <th>Salida</th>
                  <th>Tipo Hab.</th>
                  <th>Tarifa</th>
                  <th>Pax</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.conf}>
                    <td className="font-bold">{r.conf}</td>
                    <td>{r.guestName}</td>
                    <td>{r.arrival}</td>
                    <td>{r.departure}</td>
                    <td>{r.roomType}</td>
                    <td>{r.rateCode}</td>
                    <td>{r.pax}</td>
                    <td>
                      <StatusPill status={r.status} label={r.status} />
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
