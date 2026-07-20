import type { IPatrolLogs } from "@/types/scan-analytics.types";
import {
  avatarColor,
  formatDuration,
  formatHeartbeatAge,
  formatTime,
  getHeartbeatAgeMin,
  getHeartbeatLabel,
  getUserLabel,
} from "../utils";

interface PatrolCardListProps {
  patrols: IPatrolLogs[];
  now: Date;
}

export function PatrolCardList({ patrols, now }: PatrolCardListProps) {
  if (!patrols.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
        Belum ada petugas yang sedang patroli.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {patrols.map((session) => {
        const heartbeatAgeMin = getHeartbeatAgeMin(
          session.last_heartbeat_location?.updated_at,
          now,
        );
        const heartbeat = getHeartbeatLabel(heartbeatAgeMin);

        return (
          <div
            key={`${session.assignment_id}-${session.shift_id}-${session.user_id}`}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${avatarColor(
                    session.user_id,
                  )}`}
                >
                  {getUserLabel(session.user_id).charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {getUserLabel(session.user_id)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Mulai {formatTime(session.started_at)}
                  </p>
                </div>
              </div>

              <div
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${heartbeat.pill}`}
              >
                <span className={`h-2 w-2 rounded-full ${heartbeat.dot}`} />
                {heartbeat.label}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-3">
              <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-center">
                <p className="text-[11px] text-gray-400">Durasi</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-800">
                  {formatDuration(session.started_at, now)}
                </p>
              </div>

              <div className="rounded-lg bg-blue-50 px-3 py-2.5 text-center">
                <p className="text-[11px] text-blue-500">Checkpoint</p>
                <p className="mt-0.5 text-sm font-semibold text-blue-700 tabular-nums">
                  {session.total_checkpoint_passed}
                </p>
              </div>

              <div className="rounded-lg bg-red-50 px-3 py-2.5 text-center">
                <p className="text-[11px] text-red-500">Insiden</p>
                <p className="mt-0.5 text-sm font-semibold text-red-600 tabular-nums">
                  {session.total_incident}
                </p>
              </div>

              <div className="rounded-lg bg-emerald-50 px-3 py-2.5 text-center">
                <p className="text-[11px] text-emerald-500">Update</p>
                <p className="mt-0.5 text-sm font-semibold text-emerald-700 tabular-nums">
                  {formatHeartbeatAge(heartbeatAgeMin)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
