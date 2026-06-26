import type { IPatrolLogs } from "@/types/scan-analytics.types";
import {
  avatarColor,
  formatDuration,
  formatTime,
  getInitials,
  getUserLabel,
  hasGps,
} from "../utils";

interface PatrolRowProps {
  session: IPatrolLogs;
  now: Date;
}

export function PatrolRow({ session, now }: PatrolRowProps) {
  const gpsAvailable = hasGps(session.last_heartbeat_location);

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
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

      <td className="py-3 px-4 text-sm text-gray-700 tabular-nums">
        {formatDuration(session.started_at, now)}
      </td>

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

      <td className="py-3 px-4">
        <span
          className={`text-sm font-semibold tabular-nums ${
            session.total_incident > 0 ? "text-red-500" : "text-gray-300"
          }`}
        >
          {session.total_incident}
        </span>
      </td>

      <td className="py-3 px-4">
        {gpsAvailable ? (
          <span className="text-xs text-gray-500 tabular-nums">
            {session.last_heartbeat_location?.gps_lat},{" "}
            {session.last_heartbeat_location?.gps_lon}
          </span>
        ) : (
          <span className="text-xs text-gray-300">-</span>
        )}
      </td>
    </tr>
  );
}
