import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PatrolRealtimeSection from "./patrol-live";
import { PageHeader } from "@/components/shared/PageHeader";
import { MapLive } from "./map-live";
import type { IPatrolLogs } from "@/types";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:5001";

export function LiveAnalyticsPage() {
  const [patrols, setPatrols] = useState<IPatrolLogs[] | []>([]);

  useEffect(() => {
    const eventSource = new EventSource(`${BASE_URL}/patrol-logs/live-patrol`);

    eventSource.onmessage = (event) => {
      try {
        const eventData = JSON.parse(event.data);
        console.log("Received SSE event:", eventData);

        switch (eventData.type) {
          case "patrol.snapshot":
            if (eventData.data && eventData.data) {
              setPatrols(eventData.data);
            }
            break;

          case "patrol.started":
            toast.success(
              `New Patrol is Started By ${eventData.data.username} - at ${eventData.data.started_at}`,
              { duration: 3000 },
            );
            break;

          case "patrol.heartbeat":
            toast.success(
              `Heartbeat: ${eventData.data.username} melakukan update last position at ${eventData.data.gps_lat}, ${eventData.data.gps_lon}`,
              { duration: 3000 },
            );

            setPatrols((prev) => {
              const nextLocation = {
                gps_lat: eventData.data.gps_lat,
                gps_lon: eventData.data.gps_lon,
                updated_at: eventData.data.updated_at,
              };

              const updated = prev.map((patrol) =>
                patrol.user_id === eventData.data.user_id
                  ? {
                      ...patrol,
                      last_heartbeat_location: nextLocation,
                      current_history_location: [
                        ...(patrol.current_history_location ?? []),
                        nextLocation,
                      ],
                    }
                  : patrol,
              );
              return updated;
            });
            break;

          case "checkpoint.passed":
            toast.success(
              `Checkpoint Passed: ${eventData.data.username} sedang checkpoint di ${eventData.data.checkpoint_name} by ${eventData.data.scanned_at}`,
              { duration: 3000 },
            );

            setPatrols((prev) => {
              const updated = prev.map((patrol) =>
                patrol.user_id === eventData.data.user_id
                  ? {
                      ...patrol,
                      total_checkpoint_passed:
                        patrol.total_checkpoint_passed + 1,
                      current_scan_checkpoint: [
                        ...(patrol.current_scan_checkpoint ?? []),
                        {
                          checkpoint_id: eventData.data.checkpoint_id,
                          scanned_at: eventData.data.scanned_at,
                        },
                      ],
                    }
                  : patrol,
              );
              return updated;
            });
            break;

          case "incident.created":
            toast.error(
              `Incident Created: ${eventData.data.username} melaporkan ${eventData.data.incident_type} dengan tingkat ${eventData.data.severity}`,
              { duration: 3000 },
            );
            setPatrols((prev) => {
              const updated = prev.map((patrol) =>
                patrol.user_id === eventData.data.user_id
                  ? {
                      ...patrol,
                      total_incident: patrol.total_incident + 1,
                    }
                  : patrol,
              );
              return updated;
            });
            break;

          case "patrol.ended":
            toast.success(
              `Patrol Ended: ${eventData.data.username} selesai bertugas di shift ${eventData.data.shift_name}`,
              { duration: 5000 },
            );

            setTimeout(() => {
              setPatrols((prev) =>
                prev.filter(
                  (patrol) => patrol.user_id !== eventData.data.user_id,
                ),
              );
            }, 2000);

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
          <MapLive patrols={patrols} />
        </div>
      </div>
    </div>
  );
}
