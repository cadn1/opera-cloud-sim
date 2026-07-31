"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/reservations", label: "Reservas" },
  { href: "/front-desk", label: "Front Desk" },
  { href: "/housekeeping", label: "Housekeeping" },
  { href: "/cashiering", label: "Cajero / Folio" },
];

export default function TabNav() {
  const pathname = usePathname();

  return (
    <div className="flex border-b border-[#05131f] bg-navy-dark">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`border-r border-[#0f3452] px-4 py-2.5 text-[12.5px] font-semibold tracking-wide ${
              active
                ? "bg-blue-light text-navy-dark"
                : "text-[#a9c2d6] hover:bg-[#0f3d63] hover:text-white"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
