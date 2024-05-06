import Response from './Response.js';

export default class HeartbeatResponse extends Response {
  /**
   * @param result
   * @param res
   */
  static async build(result, res) {
    res.statusCode = 200;
    res.send('OK');
  }
}
