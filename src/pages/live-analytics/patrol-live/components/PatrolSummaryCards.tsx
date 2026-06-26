import { StatCard } from "./StatCard";

interface PatrolSummaryCardsProps {
  totalActive: number;
  liveCount: number;
  totalCheckpoints: number;
  totalIncidents: number;
}

export function PatrolSummaryCards({
  totalActive,
  liveCount,
  totalCheckpoints,
  totalIncidents,
}: PatrolSummaryCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard
        label="Petugas Aktif"
        value={totalActive}
        sub="Sedang berjalan"
        bg="bg-green-50"
        iconColor="bg-green-100 text-green-600"
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5"
          >
            <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
        }
      />
      <StatCard
        label="Sinyal Live"
        value={liveCount}
        sub={`dari ${totalActive} petugas`}
        bg="bg-blue-50"
        iconColor="bg-blue-100 text-blue-600"
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5"
          >
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <circle cx="12" cy="20" r="1" fill="currentColor" />
          </svg>
        }
      />
      <StatCard
        label="Checkpoint Discan"
        value={totalCheckpoints}
        bg="bg-blue-50"
        iconColor="bg-blue-100 text-blue-500"
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5"
          >
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        }
      />
      <StatCard
        label="Total Insiden"
        value={totalIncidents}
        bg={totalIncidents > 0 ? "bg-red-50" : "bg-gray-50"}
        iconColor={
          totalIncidents > 0
            ? "bg-red-100 text-red-500"
            : "bg-gray-100 text-gray-400"
        }
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-5 h-5"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line
              x1="12"
              y1="17"
              x2="12.01"
              y2="17"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        }
      />
    </div>
  );
}
