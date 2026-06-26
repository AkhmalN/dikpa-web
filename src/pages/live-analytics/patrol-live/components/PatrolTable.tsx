import type { IPatrolLogs } from "@/types/scan-analytics.types";
import { PatrolRow } from "./PatrolRow";

interface PatrolTableProps {
  patrols: IPatrolLogs[];
  now: Date;
}

const HEADERS = ["Petugas", "Durasi", "Checkpoint", "Insiden", "GPS Terakhir"];

export function PatrolTable({ patrols, now }: PatrolTableProps) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {HEADERS.map((header) => (
              <th
                key={header}
                className="py-2.5 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {patrols.map((session) => (
            <PatrolRow
              key={`${session.assignment_id}-${session.shift_id}-${session.user_id}`}
              session={session}
              now={now}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
