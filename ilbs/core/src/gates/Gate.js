import Querable from './Querable.js';

export default class Gate extends Querable {
  async handleRequest(requestCallback) {
    try {
      return requestCallback();
    } catch (err) {}
  }
}
