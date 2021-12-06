import HttpException from './http.exception';
import { HttpStatus } from './model';

export default class UnauthorizedException extends HttpException {
  constructor(public message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
