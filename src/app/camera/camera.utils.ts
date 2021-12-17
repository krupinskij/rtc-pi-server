import { Camera, CameraDTO } from './camera.types';

export const mapToDTO = ({ _id, name, sid }: Camera): CameraDTO => ({ _id, name, sid });
