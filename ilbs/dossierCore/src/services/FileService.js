import fs from "fs";
import mime from "mime-types";
import path from "path";

export default class FileService {
  /**
   * @param {Object} config Конфигурационный объект.
   * @param {string} config.documentsPath Путь к папке с документами.
   */
  constructor({ documentsPath }) {
    this.documentsPath = documentsPath;
  }

  /**
   * Возвращает файл и данные о нем (contentType и filename).
   * @param {string} filePath Путь к файлу.
   * @returns {{file: Buffer, filename: string, contentType: string|null}} - Возвращает объект с файлом, типом контента и именем файла.
   */
  get(filePath) {
    const fullPath = path.resolve(this.documentsPath, filePath);
    const file = this.#getFile(fullPath);
    const contentType = this.#getMimeType(fullPath);
    const filename = this.#getFilename(fullPath);

    return { file, contentType, filename };
  }

  /**
   * Возвращает файл по filePath.
   * @param {string} filePath Путь к файлу.
   * @returns {Buffer} - Содержимое файла в виде буфера.
   * @throws {Error} - Если файл запрашивается не из папки documentsPath.
   */
  #getFile(filePath) {
    // проверка на то что файл запрашивают из папки documentsPath
    if (!filePath.includes(this.documentsPath)) {
      throw Error("Error document path.");
    }

    return fs.readFileSync(filePath);
  }

  /**
   * Возвращает mime-тип файла.
   * @param {string} filePath Путь к файлу.
   * @returns {string|null} - Mime-тип файла, либо null, если тип не определен.
   */
  #getMimeType(filePath) {
    return mime.lookup(filePath);
  }

  /**
   * Возвращает имя файла.
   * @param {string} filePath Путь к файлу.
   * @returns {string} - Имя файла.
   */
  #getFilename(filePath) {
    // Исправление ошибки: использование 'u' флага для корректной обработки юникодных символов
    return filePath.replace(/^.*[\\/]/u, "");
  }
}
