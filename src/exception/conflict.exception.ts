import HttpException from './http.exception';
import { HttpStatus } from './model';

export default class ConflictException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}
