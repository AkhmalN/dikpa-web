export const IncidentType = {
  THEFT: "THEFT",
  VANDALISM: "VANDALISM",
  TRESPASSING: "TRESPASSING",
  FIRE: "FIRE",
  MEDICAL_EMERGENCY: "MEDICAL_EMERGENCY",
  SUSPICIOUS_ACTIVITY: "SUSPICIOUS_ACTIVITY",
  EQUIPMENT_DAMAGED: "EQUIPMENT_DAMAGED",
  UNAUTHORIZED_ACCESS: "UNAUTHORIZED_ACCESS",
  OTHER: "OTHER",
} as const;

export type IncidentType =
  (typeof IncidentType)[keyof typeof IncidentType];

export const IncidentSeverity = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;

export type IncidentSeverity =
  (typeof IncidentSeverity)[keyof typeof IncidentSeverity];

export const IncidentStatus = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
} as const;

export type IncidentStatus =
  (typeof IncidentStatus)[keyof typeof IncidentStatus];

export interface Incident {
  _id: string;
  tenant_id: string;
  patrol_log_id: string;
  incident_type: IncidentType;
  severity: IncidentSeverity;
  description: string;
  status: IncidentStatus;
  reported_by: string;
  reported_at: Date;
  upload_paths: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IncidentStatusUpdatePayload {
  status: IncidentStatus;
  resolution_note?: string;
}
