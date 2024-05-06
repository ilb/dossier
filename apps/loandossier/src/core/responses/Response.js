import AppNotifier from '../../classes/AppNotifier.js';

export default class Response {
  /**
   * @param data
   */
  static build(data) {}

  /**
   * @param res
   * @param {Exception} exception
   */
  static exception(exception, res = null) {
    AppNotifier.mailNotify(exception);
    AppNotifier.logsNotify('loandossier', exception);
    res
      .status(exception.status || 550)
      .json({ error: exception.message || 'Упс... Что-то пошло не так' });
  }

  /**
   * @param destination
   * @param permanent
   */
  static redirect(destination, permanent = false) {
    return {
      redirect: {
        destination,
        permanent,
      },
    };
  }
}
