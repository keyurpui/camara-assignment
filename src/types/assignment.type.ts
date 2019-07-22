import { Camera } from "./camera.type";
import { Vehicle } from "./vehicle.type";

export interface Assignment {
  id: number;
  cameraId: number;
  vehicleId: number;
  dateCreated: string;
  deleted: boolean;
}

export interface AssignmentsDTO {
  camera: Camera[];
  vehicle: Vehicle[];
  assignments: Assignment[];
}
