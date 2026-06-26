import type { IPatrolLogs } from "@/types/scan-analytics.types";

type DateLike = string | Date | undefined | null;

function toDate(value: DateLike): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getUserLabel(userId: string) {
  const num = userId.replace(/\D/g, "");
  return `Petugas ${num}`;
}

export function getInitials(userId: string) {
  const num = userId.replace(/\D/g, "");
  return `P${num}`;
}

export function formatDuration(startedAt: DateLike, now: Date) {
  const started = toDate(startedAt);
  if (!started) return "-";

  const diffMs = now.getTime() - started.getTime();
  const h = Math.floor(diffMs / 3600000);
  const m = Math.floor((diffMs % 3600000) / 60000);

  if (h > 0) return `${h}j ${m}m`;
  return `${Math.max(m, 0)}m`;
}

export function formatTime(value: DateLike) {
  const date = toDate(value);
  if (!date) return "-";

  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getHeartbeatAgeMin(updatedAt: DateLike, now: Date) {
  const lastUpdated = toDate(updatedAt);
  if (!lastUpdated) return Number.POSITIVE_INFINITY;

  return Math.floor((now.getTime() - lastUpdated.getTime()) / 60000);
}

export function formatHeartbeatAge(ageMin: number) {
  if (!Number.isFinite(ageMin)) return "-";
  return ageMin < 60 ? `${ageMin}m` : `${Math.floor(ageMin / 60)}j`;
}

export function getHeartbeatLabel(ageMin: number): {
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

export function hasGps(loc: IPatrolLogs["last_heartbeat_location"]): boolean {
  return loc?.gps_lat !== undefined && loc?.gps_lon !== undefined;
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

export function avatarColor(userId: string) {
  const n = parseInt(userId.replace(/\D/g, ""), 10) || 0;
  return AVATAR_BG[n % AVATAR_BG.length];
}
