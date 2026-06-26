import type { IPatrolLogs } from "@/types/scan-analytics.types";
import { useEffect, useMemo, useState } from "react";
import { getHeartbeatAgeMin } from "./utils";

export function useRealtimeNow(intervalMs = 30_000) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}

export function usePatrolSummary(patrols: IPatrolLogs[], now: Date) {
  return useMemo(() => {
    const totalActive = patrols.length;
    const liveCount = patrols.filter(
      (session) =>
        getHeartbeatAgeMin(session.last_heartbeat_location?.updated_at, now) <=
        5,
    ).length;
    const totalCheckpoints = patrols.reduce(
      (sum, session) => sum + session.total_checkpoint_passed,
      0,
    );
    const totalIncidents = patrols.reduce(
      (sum, session) => sum + session.total_incident,
      0,
    );

    return {
      totalActive,
      liveCount,
      totalCheckpoints,
      totalIncidents,
    };
  }, [patrols, now]);
}
