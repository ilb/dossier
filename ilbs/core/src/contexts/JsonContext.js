import Context from './Context.js';

export default class JsonContext extends Context {
  static async build({ req, res }) {
    return {
      type: this.type,
      request: this.buildRequest(req),
      headers: req.headers,
      url: req.url,
      res: res,
      req: req,
    };
  }
}
