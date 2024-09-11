import Exception from "./Exception.js";

export default class UnauthorizedException extends Exception {
  /**
   * @param {string} redirectUrl URL, на который будет происходить редирект при возникновении ошибки.
   */
  constructor(redirectUrl) {
    super();
    this.type = "UNAUTHORIZED";
    this.status = 403;
    this.message = "Unauthorized";
    this.redirectUrl = redirectUrl;
  }
}
