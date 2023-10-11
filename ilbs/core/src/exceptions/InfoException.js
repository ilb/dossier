import Exception from './Exception.js';

export default class InfoException extends Exception {
  constructor(message) {
    super();
    this.type = 'INFO';
    this.status = 412;
    this.message = message;
  }
}