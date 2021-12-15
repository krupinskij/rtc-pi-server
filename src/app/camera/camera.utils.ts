import { Camera, CameraDTO } from './camera.types';

export const mapToDTO = ({ _id, name }: Camera): CameraDTO => ({ _id, name });
