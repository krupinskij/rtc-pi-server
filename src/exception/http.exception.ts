import { HttpStatus } from './model';

export default class HttpException extends Error {
  constructor(message: string, public httpStatus: HttpStatus) {
    super(message);
  }
}
