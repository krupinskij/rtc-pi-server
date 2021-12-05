import { HttpStatus } from './model';
import HttpException from './http.exception';

export default class UnauthorizedException extends HttpException {
  constructor(public message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}
