import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  FolioLine,
  RATE_AMOUNTS,
  RateCode,
  Reservation,
  Room,
  RoomStatus,
  RoomType,
} from "./types";

function makeId(prefix: string) {
  return prefix + Math.random().toString(36).slice(2, 8).toUpperCase();
}

function seedRooms(): Room[] {
  const rooms: Room[] = [];
  const types: RoomType[] = ["STD", "SUP", "DLX", "STE"];
  ["1", "2", "3"].forEach((floor) => {
    for (let i = 1; i <= 8; i++) {
      const number = floor + String(i).padStart(2, "0");
      const type = types[i % types.length];
      rooms.push({
        number,
        floor,
        type,
        status: Math.random() < 0.15 ? "VD" : "VC",
      });
    }
  });
  // un par fuera de servicio para practicar excepciones
  rooms[3].status = "OO";
  rooms[10].status = "OO";
  return rooms;
}

interface PMSState {
  businessDate: string;
  nextConfSeq: number;
  reservations: Reservation[];
  rooms: Room[];
  folios: Record<string, FolioLine[]>;

  // acciones
  createReservation: (input: {
    guestName: string;
    arrival: string;
    departure: string;
    roomType: RoomType;
    rateCode: RateCode;
    pax: number;
  }) => void;
  checkIn: (conf: string, roomNumber: string) => void;
  checkOut: (conf: string) => { ok: boolean; balance: number };
  setRoomStatus: (roomNumber: string, status: RoomStatus) => void;
  postCharge: (conf: string, desc: string, amount: number) => void;
  postPayment: (conf: string, desc: string, amount: number) => void;
  folioBalance: (conf: string) => number;
  advanceBusinessDate: () => void;
  resetDemoData: () => void;
}

export const usePMS = create<PMSState>()(
  persist(
    (set, get) => ({
      businessDate: new Date().toISOString().slice(0, 10),
      nextConfSeq: 1001,
      reservations: [],
      rooms: seedRooms(),
      folios: {},

      createReservation: (input) => {
        const conf = "H" + get().nextConfSeq;
        const reservation: Reservation = {
          conf,
          guestName: input.guestName,
          arrival: input.arrival,
          departure: input.departure,
          roomType: input.roomType,
          rateCode: input.rateCode,
          pax: input.pax,
          room: null,
          status: "Reserved",
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          reservations: [...s.reservations, reservation],
          nextConfSeq: s.nextConfSeq + 1,
          folios: { ...s.folios, [conf]: [] },
        }));
      },

      checkIn: (conf, roomNumber) => {
        const state = get();
        const reservation = state.reservations.find((r) => r.conf === conf);
        const room = state.rooms.find((r) => r.number === roomNumber);
        if (!reservation || !room) return;

        const nights = Math.max(
          1,
          Math.round(
            (new Date(reservation.departure).getTime() -
              new Date(reservation.arrival).getTime()) /
              86400000
          )
        );
        const nightlyRate = RATE_AMOUNTS[reservation.rateCode];

        set((s) => ({
          rooms: s.rooms.map((r) =>
            r.number === roomNumber ? { ...r, status: "OCC" as RoomStatus } : r
          ),
          reservations: s.reservations.map((r) =>
            r.conf === conf ? { ...r, room: roomNumber, status: "In House" } : r
          ),
          folios: {
            ...s.folios,
            [conf]: [
              ...(s.folios[conf] ?? []),
              {
                id: makeId("F"),
                desc: `Alojamiento (${nights} noche/s) - Tarifa ${reservation.rateCode}`,
                charge: nightlyRate * nights,
                credit: 0,
                postedAt: new Date().toISOString(),
              },
            ],
          },
        }));
      },

      checkOut: (conf) => {
        const balance = get().folioBalance(conf);
        const reservation = get().reservations.find((r) => r.conf === conf);
        if (!reservation) return { ok: false, balance };

        set((s) => ({
          rooms: s.rooms.map((r) =>
            r.number === reservation.room ? { ...r, status: "VD" as RoomStatus } : r
          ),
          reservations: s.reservations.map((r) =>
            r.conf === conf ? { ...r, status: "Checked Out" } : r
          ),
        }));
        return { ok: true, balance };
      },

      setRoomStatus: (roomNumber, status) => {
        set((s) => ({
          rooms: s.rooms.map((r) =>
            r.number === roomNumber ? { ...r, status } : r
          ),
        }));
      },

      postCharge: (conf, desc, amount) => {
        set((s) => ({
          folios: {
            ...s.folios,
            [conf]: [
              ...(s.folios[conf] ?? []),
              { id: makeId("F"), desc, charge: amount, credit: 0, postedAt: new Date().toISOString() },
            ],
          },
        }));
      },

      postPayment: (conf, desc, amount) => {
        set((s) => ({
          folios: {
            ...s.folios,
            [conf]: [
              ...(s.folios[conf] ?? []),
              { id: makeId("F"), desc, charge: 0, credit: amount, postedAt: new Date().toISOString() },
            ],
          },
        }));
      },

      folioBalance: (conf) => {
        const lines = get().folios[conf] ?? [];
        return lines.reduce((sum, l) => sum + l.charge - l.credit, 0);
      },

      advanceBusinessDate: () => {
        set((s) => {
          const d = new Date(s.businessDate);
          d.setDate(d.getDate() + 1);
          return { businessDate: d.toISOString().slice(0, 10) };
        });
      },

      resetDemoData: () => {
        set({
          businessDate: new Date().toISOString().slice(0, 10),
          nextConfSeq: 1001,
          reservations: [],
          rooms: seedRooms(),
          folios: {},
        });
      },
    }),
    { name: "opera-cloud-sim-storage" }
  )
);
