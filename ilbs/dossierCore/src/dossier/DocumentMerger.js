/* eslint-disable no-param-reassign -- Отключение правила no-param-reassign */

import fs from "fs";
import im from "imagemagick";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";

const convert = promisify(im.convert);

export default class DocumentMerger {
  /**
   * @param {string} dossierPath Путь к досье.
   */
  constructor(dossierPath) {
    this.dossierPath = dossierPath;
  }

  /**
   * Конвертирование одной или нескольких картинок в один PDF файл.
   * @param {string|string[]} files Путь к файлу (или массив путей).
   * @param {string|null} mergePath Путь для сохранения PDF. Если null, файл будет удален после слияния.
   * @returns {Promise<Buffer>} - Возвращает буфер смердженного файла.
   */
  async merge(files, mergePath = null) {
    const tempPath = mergePath || this.generateTempPath();

    if (typeof files === "string") {
      files = [files];
    }

    await convert([...files, tempPath]);
    const mergedFile = fs.readFileSync(tempPath);

    if (!mergePath) {
      this.removeResultFile(tempPath);
    }

    return mergedFile;
  }

  /**
   * Генерирует временный путь для хранения PDF файла.
   * @returns {string} - Возвращает путь к временному PDF файлу.
   */
  generateTempPath() {
    const tempDir = `${this.dossierPath}/temp/`;

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    return `${tempDir + uuidv4()}.pdf`;
  }

  /**
   * Удаляет файл по указанному пути.
   * @param {string} path Путь к удаляемому файлу.
   * @returns {void}
   */
  removeResultFile(path) {
    fs.unlinkSync(path);
  }
}

/* eslint-enable no-param-reassign -- Включение правила no-param-reassign */
