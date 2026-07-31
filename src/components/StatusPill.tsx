const palette: Record<string, string> = {
  Reserved: "bg-blue-light text-blue",
  "In House": "bg-green-50 text-ok",
  "Checked Out": "bg-gray-100 text-muted",
  "No Show": "bg-red-50 text-danger",
  Cancelled: "bg-gray-100 text-muted",
  VC: "bg-green-50 text-ok",
  VD: "bg-yellow-50 text-warn",
  OCC: "bg-blue-light text-blue",
  OO: "bg-red-50 text-danger",
};

export default function StatusPill({ status, label }: { status: string; label: string }) {
  const cls = palette[status] ?? "bg-gray-100 text-muted";
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-wide ${cls}`}
    >
      {label}
    </span>
  );
}
