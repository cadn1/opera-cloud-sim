export type ReservationStatus = "Reserved" | "In House" | "Checked Out" | "No Show" | "Cancelled";

export type RoomType = "STD" | "SUP" | "DLX" | "STE";

export type RateCode = "BAR" | "CORP" | "PKG" | "GOV";

export type RoomStatus = "VC" | "VD" | "OCC" | "OO"; // Vacant Clean / Vacant Dirty / Occupied / Out of Order

export interface Room {
  number: string;
  floor: string;
  type: RoomType;
  status: RoomStatus;
}

export interface Reservation {
  conf: string;
  guestName: string;
  arrival: string; // ISO date
  departure: string; // ISO date
  roomType: RoomType;
  rateCode: RateCode;
  pax: number;
  room: string | null;
  status: ReservationStatus;
  createdAt: string;
}

export interface FolioLine {
  id: string;
  desc: string;
  charge: number;
  credit: number;
  postedAt: string;
}

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  STD: "Estándar",
  SUP: "Superior",
  DLX: "Deluxe",
  STE: "Suite",
};

export const RATE_LABELS: Record<RateCode, string> = {
  BAR: "Best Available Rate",
  CORP: "Corporativa",
  PKG: "Paquete",
  GOV: "Gubernamental",
};

export const RATE_AMOUNTS: Record<RateCode, number> = {
  BAR: 65000,
  CORP: 58000,
  PKG: 72000,
  GOV: 50000,
};

export const ROOM_STATUS_LABELS: Record<RoomStatus, string> = {
  VC: "Vacía Limpia",
  VD: "Vacía Sucia",
  OCC: "Ocupada",
  OO: "Fuera de Servicio",
};
