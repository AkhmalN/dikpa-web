import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import type { IPatrolLogs } from "@/types";
import { useSSE } from "@/hooks/use-sse";

const BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || "http://localhost:5001/api/v1";

interface UsePatrolLiveSSEResult {
  patrols: IPatrolLogs[];
}

/**
 * Hook for patrol live SSE connection.
 * Parses patrol events (snapshot, started, heartbeat, checkpoint, incident, ended)
 * and maintains patrols state.
 */
export function usePatrolLiveSSE(): UsePatrolLiveSSEResult {
  const [patrols, setPatrols] = useState<IPatrolLogs[]>([]);

  const handleSSEEvent = useCallback((eventData: Record<string, unknown>) => {
    const d = eventData.data as Record<string, unknown> | undefined;

    switch (eventData.type) {
      case "patrol.snapshot":
        if (Array.isArray(d)) {
          setPatrols(d as IPatrolLogs[]);
        }
        break;

      case "patrol.started":
        toast.success(
          `New Patrol is Started By ${d?.username} - at ${d?.started_at}`,
          { duration: 3000 },
        );
        break;

      case "patrol.heartbeat": {
        const gpsLat = d?.gps_lat as number;
        const gpsLon = d?.gps_lon as number;
        const updatedAt = new Date((d?.updated_at as string) ?? Date.now());
        const userId = d?.user_id as string;

        toast.success(
          `Heartbeat: ${d?.username} melakukan update last position at ${gpsLat}, ${gpsLon}`,
          { duration: 3000 },
        );

        setPatrols((prev) =>
          prev.map((patrol) =>
            patrol.user_id === userId
              ? {
                  ...patrol,
                  last_heartbeat_location: {
                    gps_lat: gpsLat,
                    gps_lon: gpsLon,
                    updated_at: updatedAt,
                  },
                  current_history_location: [
                    ...(patrol.current_history_location ?? []),
                    {
                      gps_lat: gpsLat,
                      gps_lon: gpsLon,
                      updated_at: updatedAt,
                    },
                  ],
                }
              : patrol,
          ),
        );
        break;
      }

      case "checkpoint.passed": {
        const userId = d?.user_id as string;
        const checkpointId = d?.checkpoint_id as string;
        const scannedAt = new Date((d?.scanned_at as string) ?? Date.now());

        toast.success(
          `Checkpoint Passed: ${d?.username} sedang checkpoint di ${d?.checkpoint_name} by ${d?.scanned_at}`,
          { duration: 3000 },
        );

        setPatrols((prev) =>
          prev.map((patrol) =>
            patrol.user_id === userId
              ? {
                  ...patrol,
                  total_checkpoint_passed: patrol.total_checkpoint_passed + 1,
                  current_scan_checkpoint: [
                    ...(patrol.current_scan_checkpoint ?? []),
                    {
                      checkpoint_id: checkpointId,
                      scanned_at: scannedAt,
                    },
                  ],
                }
              : patrol,
          ),
        );
        break;
      }

      case "incident.created":
        toast.error(
          `Incident Created: ${d?.username} melaporkan ${d?.incident_type} dengan tingkat ${d?.severity}`,
          { duration: 3000 },
        );
        setPatrols((prev) =>
          prev.map((patrol) =>
            patrol.user_id === (d?.user_id as string)
              ? {
                  ...patrol,
                  total_incident: patrol.total_incident + 1,
                }
              : patrol,
          ),
        );
        break;

      case "patrol.ended": {
        const userId = d?.user_id as string;
        toast.success(
          `Patrol Ended: ${d?.username} selesai bertugas di shift ${d?.shift_name}`,
          { duration: 5000 },
        );

        setTimeout(() => {
          setPatrols((prev) =>
            prev.filter((patrol) => patrol.user_id !== userId),
          );
        }, 2000);
        break;
      }

      default:
        break;
    }
  }, []);

  const token = localStorage.getItem("access_token");

  useSSE({
    url: `${BASE_URL}/patrol-logs/live-patrol`,
    token,
    onMessage: handleSSEEvent,
  });

  return { patrols };
}
