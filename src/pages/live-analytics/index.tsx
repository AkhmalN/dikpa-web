import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PatrolRealtimeSection from "./patrol-live";
import { PageHeader } from "@/components/shared/PageHeader";
import { MapLive } from "./map-live";

export function LiveAnalyticsPage() {
  const [patrols, setPatrols] = useState([]);
  const [locations, setLocations] = useState<
    { username: string; lng: number; lat: number }[]
  >([]);

  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:5001/api/v1/patrol-logs/live-patrol",
    );

    eventSource.onmessage = (event) => {
      try {
        const eventData = JSON.parse(event.data);
        console.log("Received SSE event:", eventData);

        switch (eventData.type) {
          case "patrol.started":
            console.log("Patrol started:", eventData);
            toast.success(
              `New Patrol is Started: ${eventData.data.shift_id} - ${eventData.data.username} - at ${eventData.data.started_at}`,
              { duration: 3000 },
            );
            break;

          case "patrol.snapshot":
            console.log("Patrol snapshot updated:", eventData);
            if (eventData.data && eventData.data.data) {
              setPatrols(eventData.data.data);

              // Extract last_heartbeat_location from each patrol
              const newLocations = eventData.data.data
                .filter(
                  (patrol: any) =>
                    patrol.username &&
                    patrol.last_heartbeat_location &&
                    patrol.last_heartbeat_location.gps_lon &&
                    patrol.last_heartbeat_location.gps_lat,
                )
                .map((patrol: any) => ({
                  username: patrol.username,
                  lng: patrol.last_heartbeat_location.gps_lon,
                  lat: patrol.last_heartbeat_location.gps_lat,
                }));

              setLocations(newLocations);
            }
            break;

          case "patrol.heartbeat":
            console.log("Patrol heartbeat:", eventData);

            toast.success(
              `Heartbeat: update last position at ${eventData.data.gps_lat}, ${eventData.data.gps_lon}`,
              { duration: 3000 },
            );

            break;

          case "checkpoint.passed":
            console.log("Checkpoint passed event received:", eventData);
            toast.success(
              `Checkpoint Passed: ${eventData.data.checkpoint_name} by ${eventData.data.scanned_at}`,
              { duration: 3000 },
            );
            break;

          case "incident.created":
            console.log("Incident created:", eventData);

            break;

          default:
            break;
        }
      } catch (err) {
        console.error("Failed to parse SSE event:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <PageHeader
          title="Live Analytics"
          description="Status petugas yang sedang bertugas"
        />

        {/* Charts row */}
        <div>
          <PatrolRealtimeSection patrols={patrols} />
        </div>
      </div>
      <div>
        <PageHeader
          title="Live Map"
          description="Peta lokasi petugas secara real-time"
        />
        <div>
          <MapLive locations={locations} />
        </div>
      </div>
    </div>
  );
}
