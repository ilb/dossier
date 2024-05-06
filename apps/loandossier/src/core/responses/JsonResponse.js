import Response from './Response.js';

export default class JsonResponse extends Response {
  /**
   * @param result
   * @param res
   */
  static async build(result, res) {
    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.json(result);
    } else {
      res.end();
    }
  }
}
