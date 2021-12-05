import { HttpStatus } from './model';
import HttpException from './http.exception';

export default class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
