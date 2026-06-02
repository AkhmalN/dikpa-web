export type AssignmentStatus = "PENDING" | "ACTIVE" | "CANCELLED" | "COMPLETED";
export type Period = "daily" | "weekly" | "monthly" | "yearly";

export interface Assignment {
  _id: string;
  user_id: string;
  user_name?: string;
  shift_id: string;
  shift_name?: string;
  shift_start_time?: string;
  shift_end_time?: string;
  duty_date?: string;
  assigned_checkpoint_ids: string[];
  status: AssignmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentPayload {
  user_id: string;
  shift_id: string;
  duty_date: string;
  assigned_checkpoint_ids: string[];
  status: AssignmentStatus;
  notes?: string;
}
