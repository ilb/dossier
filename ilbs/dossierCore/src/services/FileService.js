import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export default class FileService {
  /**
   * @param {string} documentsPath
   */
  constructor({ documentsPath }) {
    this.documentsPath = documentsPath;
  }

  /**
   * Возвращает файл (file) и данные о нем (contentTpe и filename)
   *
   * @param filePath
   * @returns {{file: Buffer, filename, contentType}}
   */
  get(filePath) {
    const fullPath = path.resolve(this.documentsPath, filePath);
    const file = this.#getFile(fullPath);
    const contentType = this.#getMimeType(fullPath);
    const filename = this.#getFilename(fullPath);

    return { file, contentType, filename };
  }

  /**
   * Возвращает файл по filePath
   *
   * @param filePath
   * @returns {Buffer}
   */
  #getFile(filePath) {
    // проверка на то что файл запрашивают из папки documentsPath
    if (filePath.indexOf(this.documentsPath) === -1) {
      throw Error('Error document path.');
    }

    return fs.readFileSync(filePath);
  }

  /**
   * Возвращает mimeType файла
   *
   * @param filePath
   * @returns {*}
   */
  #getMimeType(filePath) {
    return mime.lookup(filePath);
  }

  /**
   * Возвращает имя файла
   *
   * @param filePath
   * @returns {*}
   */
  #getFilename(filePath) {
    return filePath.replace(/^.*[\\/]/, '');
  }
}
