import type { IPatrolLogs } from "@/types/scan-analytics.types";
import { usePatrolSummary, useRealtimeNow } from "./patrol-live/hooks";
import { PatrolSummaryCards } from "./patrol-live/components/PatrolSummaryCards";
import { PatrolTable } from "./patrol-live/components/PatrolTable";

interface PatrolRealtimeSectionProps {
  patrols: IPatrolLogs[];
}

export default function PatrolRealtimeSection({
  patrols,
}: PatrolRealtimeSectionProps) {
  const now = useRealtimeNow();
  const { totalActive, liveCount, totalCheckpoints, totalIncidents } =
    usePatrolSummary(patrols, now);

  return (
    <div className="space-y-6">
      <PatrolSummaryCards
        totalActive={totalActive}
        liveCount={liveCount}
        totalCheckpoints={totalCheckpoints}
        totalIncidents={totalIncidents}
      />
      <PatrolTable patrols={patrols} now={now} />
    </div>
  );
}
