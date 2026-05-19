import { useState, useEffect } from "react";

type Session = {
  _id: string;
  shift_id: string;
  user_id: string;
  status: string;
  started_at: string;
  last_heartbeat_location: {
    gps_lat?: number;
    gps_lon?: number;
    updated_at: string;
  };
  total_checkpoint_passed: number;
  total_incident: number;
  updatedAt: string;
};

function getUserLabel(userId: string) {
  const num = userId.replace(/\D/g, "");
  return `Petugas ${num}`;
}

function getInitials(userId: string) {
  const num = userId.replace(/\D/g, "");
  return `P${num}`;
}

function formatDuration(startedAt: string, now: Date) {
  const diffMs = now.getTime() - new Date(startedAt).getTime();
  const h = Math.floor(diffMs / 3600000);
  const m = Math.floor((diffMs % 3600000) / 60000);
  if (h > 0) return `${h}j ${m}m`;
  return `${m}m`;
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getHeartbeatAgeMin(updatedAt: string, now: Date) {
  return Math.floor((now.getTime() - new Date(updatedAt).getTime()) / 60000);
}

function getHeartbeatLabel(ageMin: number): {
  label: string;
  dot: string;
  text: string;
  pill: string;
} {
  if (ageMin <= 5)
    return {
      label: "Live",
      dot: "bg-green-500",
      text: "text-green-700",
      pill: "bg-green-50 text-green-700 border border-green-200",
    };
  if (ageMin <= 30)
    return {
      label: "Stale",
      dot: "bg-amber-400",
      text: "text-amber-700",
      pill: "bg-amber-50 text-amber-700 border border-amber-200",
    };
  return {
    label: "Offline",
    dot: "bg-gray-300",
    text: "text-gray-400",
    pill: "bg-gray-100 text-gray-500 border border-gray-200",
  };
}

function hasGps(loc: Session["last_heartbeat_location"]): boolean {
  return "gps_lat" in loc;
}

const AVATAR_BG = [
  "bg-rose-100 text-rose-700",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-cyan-100 text-cyan-700",
  "bg-pink-100 text-pink-700",
  "bg-teal-100 text-teal-700",
];

function avatarColor(userId: string) {
  const n = parseInt(userId.replace(/\D/g, ""), 10) || 0;
  return AVATAR_BG[n % AVATAR_BG.length];
}

// ─── Sub-components ────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon,
  bg,
  iconColor,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  bg: string;
  iconColor: string;
}) {
  return (
    <div className={`rounded-2xl p-5 flex flex-col gap-3 ${bg}`}>
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}
        >
          {icon}
        </span>
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-900 leading-none">
          {value}
        </div>
        {sub && <div className="text-sm text-gray-500 mt-1">{sub}</div>}
      </div>
    </div>
  );
}

function PatrolRow({ session, now }: { session: Session; now: Date }) {
  const age = getHeartbeatAgeMin(
    session.last_heartbeat_location.updated_at,
    now,
  );
  const hb = getHeartbeatLabel(age);
  const gps = hasGps(session.last_heartbeat_location);

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
      {/* Petugas */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(
              session.user_id,
            )}`}
          >
            {getInitials(session.user_id)}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">
              {getUserLabel(session.user_id)}
            </div>
            <div className="text-xs text-gray-400">
              {formatTime(session.started_at)}
            </div>
          </div>
        </div>
      </td>

      {/* Durasi */}
      <td className="py-3 px-4 text-sm text-gray-700 tabular-nums">
        {formatDuration(session.started_at, now)}
      </td>

      {/* Checkpoint */}
      <td className="py-3 px-4">
        <span
          className={`text-sm font-semibold tabular-nums ${
            session.total_checkpoint_passed > 0
              ? "text-blue-600"
              : "text-gray-300"
          }`}
        >
          {session.total_checkpoint_passed}
        </span>
      </td>

      {/* Insiden */}
      <td className="py-3 px-4">
        <span
          className={`text-sm font-semibold tabular-nums ${
            session.total_incident > 0 ? "text-red-500" : "text-gray-300"
          }`}
        >
          {session.total_incident}
        </span>
      </td>

      {/* Lokasi */}
      <td className="py-3 px-4">
        {gps ? (
          <span className="text-xs text-gray-500 tabular-nums">
            {(session.last_heartbeat_location as any).gps_lat}°,{" "}
            {(session.last_heartbeat_location as any).gps_lon}°
          </span>
        ) : (
          <span className="text-xs text-gray-300">—</span>
        )}
      </td>

      {/* Sinyal */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${hb.dot} ${
              hb.label === "Live" ? "animate-pulse" : ""
            }`}
          />
          <span className={`text-xs font-medium ${hb.text}`}>
            {hb.label}
            <span className="font-normal text-gray-400 ml-1">
              {age < 60 ? `${age}m` : `${Math.floor(age / 60)}j`}
            </span>
          </span>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function PatrolRealtimeSection({
  patrols,
}: {
  patrols: Session[];
}) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const totalActive = patrols.length;
  const liveCount = patrols.filter(
    (s) => getHeartbeatAgeMin(s.last_heartbeat_location.updated_at, now) <= 5,
  ).length;
  const totalCheckpoints = patrols.reduce(
    (a, s) => a + s.total_checkpoint_passed,
    0,
  );
  const totalIncidents = patrols.reduce((a, s) => a + s.total_incident, 0);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
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
          bg="bg-rose-50"
          iconColor="bg-rose-100 text-rose-500"
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

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {[
                "Petugas",
                "Durasi",
                "Checkpoint",
                "Insiden",
                "Lokasi GPS",
                "Sinyal",
              ].map((h) => (
                <th
                  key={h}
                  className="py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patrols.map((session) => (
              <PatrolRow key={session._id} session={session} now={now} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Live (≤5m)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Stale (5–30m)
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          Offline (&gt;30m)
        </div>
        <span className="ml-auto">Diperbarui setiap 30 detik</span>
      </div>
    </div>
  );
}
