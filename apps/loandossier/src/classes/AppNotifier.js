import { notify } from '@ilb/mailer/src/errormailer.js';
import createDebug from 'debug';

import Exception from '../core/exceptions/Exception.js';

const debug = createDebug('loandossier');

export default class AppNotifier {
  /**
   *
   */
  constructor() {}
  /**
   * Send error to mail
   * @param {Error} error
   */
  static mailNotify(error) {
    notify(error).catch(console.error);
  }
  /**
   * Show logs info if debug enabled
   * @param {string} title debug title, for example "loandeal" or "loandeal_some_class", this title enabled this logs
   * @param {string} info debug info, some text or error message
   */
  static logsNotify(title, info) {
    if (!title && !info) {
      throw new Exception('Не переданы параметры в debug');
    }
    debug(title, info);
  }
}
