import Exception from './Exception.js';

export default class UnauthorizedException extends Exception {
  constructor(redirectUrl) {
    super();
    this.type = 'UNAUTHORIZED';
    this.status = 403;
    this.message = 'Unauthorized';
    this.redirectUrl = redirectUrl;
  }
}