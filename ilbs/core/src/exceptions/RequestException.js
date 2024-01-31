import CriticalException from './CriticalException.js';

export default class RequestException extends CriticalException {
  constructor(url, error) {
    const message = `Error request to ${url}. Error message: ${JSON.stringify(error)}`;
    console.log(message);
    super(message);
  }
}
