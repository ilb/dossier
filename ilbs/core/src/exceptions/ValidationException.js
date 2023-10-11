import Exception from './Exception.js';

export default class ValidationException extends Exception {
  constructor(message) {
    super();
    this.type = 'VALIDATION';
    this.status = 400;
    this.message = message;
  }
}