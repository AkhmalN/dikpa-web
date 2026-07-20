"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_STYLES } from "./constants/map-style";
import type { IPatrolLogs } from "@/types";
import { apiClient } from "@/lib/axios";
import {
  formatDuration,
  formatHeartbeatAge,
  formatTime,
  getHeartbeatAgeMin,
  getHeartbeatLabel,
  getUserLabel,
} from "./patrol-live/utils";

type Props = {
  patrols: IPatrolLogs[];
  now: Date;
};

const OFFICE_CENTER: [number, number] = [106.8186, -6.4025];

/** Distance (meters) between two lng/lat points using haversine approximation */
const approxDistanceM = (a: [number, number], b: [number, number]): number => {
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLon = ((b[0] - a[0]) * Math.PI) / 180;
  const latMid = ((a[1] + b[1]) * Math.PI) / 360;
  const r = 6371000;
  const x = dLon * Math.cos(latMid);
  return Math.sqrt(x * x + dLat * dLat) * r;
};

const MIN_MARKER_MOVE_M = 5; // ignore GPS jitter < 5 meters

export const MapLive = ({ patrols, now }: Props) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());

  // Dialog state: store _id, fetch from API when dialog opens
  const [selectedPatrolId, setSelectedPatrolId] = useState<string | null>(null);
  const [dialogPatrol, setDialogPatrol] = useState<IPatrolLogs | null>(null);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const fetchPatrol = useCallback(async (patrolId: string) => {
    setDialogLoading(true);
    setDialogError(null);
    try {
      const res = await apiClient.get<{ success: boolean; data: IPatrolLogs }>(
        `/patrol-logs/${patrolId}`,
      );
      setDialogPatrol(res.data.data);
    } catch {
      setDialogError("Gagal memuat data patroli.");
    } finally {
      setDialogLoading(false);
    }
  }, []);

  const openDialog = useCallback(
    (patrolId: string) => {
      setSelectedPatrolId(patrolId);
      setDialogPatrol(null);
      fetchPatrol(patrolId);
    },
    [fetchPatrol],
  );

  const closeDialog = useCallback(() => {
    setSelectedPatrolId(null);
    setDialogPatrol(null);
    setDialogError(null);
  }, []);

  const routeGeoJsonRef = useRef<GeoJSON.FeatureCollection<GeoJSON.LineString>>(
    {
      type: "FeatureCollection",
      features: [],
    },
  );

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLES.SATELLITE.style as maplibregl.StyleSpecification,
      center: OFFICE_CENTER,
      zoom: 15,
    });

    mapRef.current = map;

    // Initialize markers will be created when locations arrive

    map.on("load", () => {
      map.addSource("route", {
        type: "geojson",
        data: routeGeoJsonRef.current,
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#22c55e",
          "line-width": 4,
          "line-opacity": 0.8,
          "line-dasharray": [1.5, 1.5],
        },
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  // HANDLE LOCATION UPDATE
  useEffect(() => {
    if (!patrols.length) return;

    const map = mapRef.current;
    if (!map) return;

    const routeFeatures: GeoJSON.Feature<GeoJSON.LineString>[] = [];

    // Update or create markers for each user location
    patrols.forEach((patrol) => {
      const historyCoordinates =
        patrol.current_history_location
          ?.map(
            (location) =>
              [location.gps_lon, location.gps_lat] as [number, number],
          )
          .filter(([lng, lat]) => lng !== 0 && lat !== 0) ?? [];

      const latestCoordinate =
        historyCoordinates.at(-1) ??
        (patrol.last_heartbeat_location?.gps_lon &&
        patrol.last_heartbeat_location?.gps_lat
          ? ([
              patrol.last_heartbeat_location.gps_lon,
              patrol.last_heartbeat_location.gps_lat,
            ] as [number, number])
          : null);

      if (historyCoordinates.length >= 2) {
        routeFeatures.push({
          type: "Feature",
          properties: {
            user_id: patrol.user_id,
          },
          geometry: {
            type: "LineString",
            coordinates: historyCoordinates,
          },
        });
      }

      if (!latestCoordinate) return;

      const userId = patrol.user_id.toString();
      const existingMarker = markersRef.current.get(userId);

      if (existingMarker) {
        const currentLngLat = existingMarker.getLngLat();
        const dist = approxDistanceM(
          [currentLngLat.lng, currentLngLat.lat],
          latestCoordinate,
        );

        if (dist >= MIN_MARKER_MOVE_M) {
          existingMarker.setLngLat(latestCoordinate);
        }
      } else {
        const markerEl = document.createElement("div");
        markerEl.className =
          "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-green-500 shadow-lg ring-2 ring-white";
        markerEl.innerHTML = `<span style="color:#fff;font-size:12px;font-weight:700;">${getUserLabel(patrol.user_id).charAt(0).toUpperCase()}</span>`;
        markerEl.addEventListener("click", () => {
          openDialog(patrol._id);
        });

        const marker = new maplibregl.Marker({ element: markerEl })
          .setLngLat(latestCoordinate)
          .addTo(map);

        markersRef.current.set(userId, marker);
      }
    });

    routeGeoJsonRef.current.features = routeFeatures;

    // Refresh source
    const source = map.getSource("route") as maplibregl.GeoJSONSource;
    if (source) {
      source.setData(routeGeoJsonRef.current);
    }
  }, [patrols]);

  return (
    <>
      <Card className="overflow-hidden border-gray-200">
        <CardContent className="p-0">
          <div
            ref={mapContainer}
            className="h-[55vh] min-h-105 w-full rounded-md"
          />
        </CardContent>
      </Card>

      <Dialog
        open={selectedPatrolId !== null}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="max-w-sm">
          {dialogLoading && (
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
              </div>
              <Skeleton className="h-10 rounded-lg" />
            </div>
          )}

          {dialogError && (
            <div className="py-6 text-center text-sm text-red-500">
              {dialogError}
            </div>
          )}

          {!dialogLoading && !dialogError && dialogPatrol && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base">
                  <span
                    className={`inline-flex h-3 w-3 rounded-full ${
                      getHeartbeatLabel(
                        getHeartbeatAgeMin(
                          dialogPatrol.last_heartbeat_location?.updated_at,
                          now,
                        ),
                      ).dot
                    }`}
                  />
                  {getUserLabel(dialogPatrol.user_id)}
                </DialogTitle>
              </DialogHeader>

              {(() => {
                const patrol = dialogPatrol;
                const heartbeatAgeMin = getHeartbeatAgeMin(
                  patrol.last_heartbeat_location?.updated_at,
                  now,
                );
                const heartbeat = getHeartbeatLabel(heartbeatAgeMin);

                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-gray-50 px-4 py-3 text-center">
                        <p className="text-xs text-gray-400">Mulai</p>
                        <p className="mt-0.5 text-sm font-semibold text-gray-800">
                          {formatTime(patrol.started_at)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 px-4 py-3 text-center">
                        <p className="text-xs text-gray-400">Durasi</p>
                        <p className="mt-0.5 text-sm font-semibold text-gray-800">
                          {formatDuration(patrol.started_at, now)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg bg-blue-50 px-4 py-3 text-center">
                        <p className="text-xs text-blue-500">Checkpoint</p>
                        <p className="mt-0.5 text-lg font-bold text-blue-700 tabular-nums">
                          {patrol.total_checkpoint_passed}
                        </p>
                      </div>
                      <div className="rounded-lg bg-red-50 px-4 py-3 text-center">
                        <p className="text-xs text-red-500">Insiden</p>
                        <p className="mt-0.5 text-lg font-bold text-red-600 tabular-nums">
                          {patrol.total_incident}
                        </p>
                      </div>
                      <div className="rounded-lg bg-emerald-50 px-4 py-3 text-center">
                        <p className="text-xs text-emerald-500">Update</p>
                        <p className="mt-0.5 text-lg font-bold text-emerald-700 tabular-nums">
                          {formatHeartbeatAge(heartbeatAgeMin)}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${heartbeat.pill}`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${heartbeat.dot}`}
                      />
                      {heartbeat.label}
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
