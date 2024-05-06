import Exception from './Exception.js';

export default class DatabaseException extends Exception {
  /**
   * @param message
   */
  constructor(message) {
    super();
    this.message = message;
  }
}
