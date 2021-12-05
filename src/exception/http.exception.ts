import { HttpStatus } from './types';

export default class HttpException extends Error {
  constructor(message: string, public httpStatus: HttpStatus) {
    super(message);
  }
}
