export interface Checkpoint {
  _id: string;
  name: string;
  qr_code_value: string;
  gps_lat: number;
  gps_lon: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckpointPayload {
  name: string;
  qr_code_value: string;
  gps_lat: number;
  gps_lon: number;
  description?: string;
}
