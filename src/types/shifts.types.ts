export interface Shift {
  _id: string;
  shift_name: string;
  shift_start_time: string;
  shift_end_time: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShiftPayload {
  shift_name: string;
  shift_start_time: string;
  shift_end_time: string;
}
