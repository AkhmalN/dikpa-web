import PatrolRealtimeSection from "./patrol-live";
import { PageHeader } from "@/components/shared/PageHeader";
import { MapLive } from "./map-live";
import { useRealtimeNow } from "./patrol-live/hooks";
import { usePatrolLiveSSE } from "./patrol-live/hooks/use-patrol-live-sse";

export function LiveAnalyticsPage() {
  const { patrols } = usePatrolLiveSSE();
  const now = useRealtimeNow();
  return (
    <div className="space-y-4">
      <PageHeader
        title="Live Analytics"
        description="Status petugas yang sedang bertugas"
      />
      <PatrolRealtimeSection patrols={patrols} />
      <MapLive patrols={patrols} now={now} />
    </div>
  );
}
