"use client";

import { useMemo, useState } from "react";
import { usePMS } from "@/lib/store";

export default function CashieringPage() {
  const reservations = usePMS((s) => s.reservations);
  const folios = usePMS((s) => s.folios);
  const postCharge = usePMS((s) => s.postCharge);
  const postPayment = usePMS((s) => s.postPayment);
  const folioBalance = usePMS((s) => s.folioBalance);

  const guests = useMemo(() => reservations.filter((r) => r.status !== "Reserved"), [reservations]);

  const [selected, setSelected] = useState<string>(guests[0]?.conf ?? "");
  const conf = selected || guests[0]?.conf || "";
  const reservation = guests.find((g) => g.conf === conf);

  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  function handleCharge() {
    const val = parseInt(amount) || 0;
    if (val <= 0) {
      alert("Ingresá un monto válido.");
      return;
    }
    postCharge(conf, desc.trim() || "Cargo varios", val);
    setDesc("");
    setAmount("");
  }

  function handlePayment() {
    const val = parseInt(amount) || 0;
    if (val <= 0) {
      alert("Ingresá un monto válido.");
      return;
    }
    postPayment(conf, desc.trim() || "Pago", val);
    setDesc("");
    setAmount("");
  }

  if (guests.length === 0) {
    return (
      <div className="panel">
        <div className="panel-header">Seleccionar folio</div>
        <div className="panel-body">
          <div className="p-5 text-center italic text-muted">
            Todavía no hay huéspedes con folio. Hacé un Check-In primero.
          </div>
        </div>
      </div>
    );
  }

  const items = folios[conf] ?? [];
  const balance = folioBalance(conf);

  return (
    <>
      <div className="panel">
        <div className="panel-header">Seleccionar folio</div>
        <div className="panel-body">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="field-label">Huésped / Reserva</label>
              <select className="field-input" value={conf} onChange={(e) => setSelected(e.target.value)}>
                {guests.map((g) => (
                  <option key={g.conf} value={g.conf}>
                    {g.conf} — {g.guestName} ({g.status})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Descripción</label>
              <input
                className="field-input"
                placeholder="Ej: Room Service"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Monto (CLP)</label>
              <input
                type="number"
                min={0}
                className="field-input"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="btn-primary" onClick={handleCharge}>
              Agregar cargo
            </button>
            <button className="btn-secondary" onClick={handlePayment}>
              Registrar pago
            </button>
          </div>
        </div>
      </div>

      {reservation && (
        <div className="panel">
          <div className="panel-header">
            <span>
              Folio — {reservation.guestName} ({conf}) · Hab. {reservation.room ?? "—"}
            </span>
            <span>{items.length} movimiento/s</span>
          </div>
          <div className="panel-body !p-0">
            {items.length === 0 ? (
              <div className="p-5 text-center italic text-muted">Folio sin movimientos.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Descripción</th>
                    <th>Cargo</th>
                    <th>Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((i) => (
                    <tr key={i.id}>
                      <td>{i.desc}</td>
                      <td>{i.charge ? "$" + i.charge.toLocaleString("es-CL") : ""}</td>
                      <td>{i.credit ? "$" + i.credit.toLocaleString("es-CL") : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="flex justify-end gap-6 border-t border-border bg-blue-light px-3 py-2.5 font-bold">
            <span>Saldo: ${balance.toLocaleString("es-CL")}</span>
          </div>
        </div>
      )}
    </>
  );
}
