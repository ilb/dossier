import Exception from './Exception.js';

export default class CriticalException extends Exception {
  constructor(message) {
    super();
    this.type = 'CRITICAL';
    this.status = 500;
    this.message = message;
  }
}
