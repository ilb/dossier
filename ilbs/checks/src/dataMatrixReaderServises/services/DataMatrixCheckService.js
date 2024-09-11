/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */

import Service from "@ilb/core/src/base/Service.js";
// import { loadImage } from 'canvas';
import {
  BinaryBitmap,
  HTMLCanvasElementLuminanceSource,
  HybridBinarizer,
  MultiFormatReader,
} from "@zxing/library";
import { exec } from "child_process";
import fs from "fs";

import CropService from "./CropService.js";
import FlipService from "./FlipService.js";

export default class DataMatrixCheckService extends Service {
  /**
   * Создает экземпляр DataMatrixCheckService
   */
  constructor() {
    super();
    this.flipService = new FlipService();
    this.cropService = new CropService();
    this.reader = new MultiFormatReader();
  }

  /**
   * Декодирует содержимое canvas.
   * @param {HTMLCanvasElement} canvas Канвас для декодирования.
   * @param {string} name Имя файла для идентификации.
   * @returns {Promise<string|null>} - Возвращает декодированный результат или null.
   */
  async decodeCanvas(canvas, name) {
    let result;

    try {
      const zXingPromise = this.zXing(canvas.canvas);
      const dmtxReadPromise = this.dmtxRead(canvas.path);

      result = await Promise.race([
        Promise.any([zXingPromise, dmtxReadPromise]),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error("Тайм-аут операции"));
          }, 300);
        }),
      ]);
    } catch (err) {
      // Ошибка обработана
    }
    fs.unlink(canvas.path, error => {});
    return result;
  }

  /**
   * Декодирует файл с помощью dmtxread.
   * @param {string} path Путь к файлу.
   * @param {Function} [callback] Неиспользуемый параметр.
   * @returns {Promise<string>} - Возвращает результат декодирования.
   */
  async dmtxRead(path, callback) {
    return new Promise((resolve, reject) => {
      exec(`dmtxread -N1 ${path}`, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout);
      });
    });
  }

  /**
   * Декодирует содержимое canvas с помощью библиотеки zXing.
   * @param {HTMLCanvasElement} canvas Канвас для декодирования.
   * @returns {Promise<string>} - Возвращает текст декодированного результата.
   */
  async zXing(canvas) {
    const luminanceSource = new HTMLCanvasElementLuminanceSource(canvas);
    const bitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
    const hints = new Map();
    const result = await this.reader.decode(bitmap, hints);

    return result.text;
  }

  /**
   * Декодирует изображение по параметрам.
   * @param {HTMLImageElement} image Изображение для декодирования.
   * @param {Array<Object>} params Параметры для кропа.
   * @param {string} name Имя файла для идентификации.
   * @returns {Promise<string|null>} - Возвращает декодированный результат или null.
   */
  async decodeImage(image, params, name) {
    let decoded = null;

    for (const param of params) {
      const croppCanvas = await this.cropService.crop(image, param, name);

      decoded = await this.decodeCanvas(croppCanvas, name);
      if (decoded) {
        break;
      }
    }
    return decoded;
  }

  /* eslint-disable no-undef -- Включение правила no-undef */
  /**
   * Декодирует файл.
   * @param {Object} file Файл для декодирования.
   * @param {Array<Object>} params Параметры для обработки изображения.
   * @returns {Promise<string|null>} - Возвращает декодированный результат или null.
   */
  async decodeFile(file, params) {
    const image = await loadImage(file.uri); // Загружаем изображение из файла
    let decode = await this.decodeImage(image, params, file.name);

    if (!decode) {
      const turnOverImage = await this.flipService.turnOver(image);

      decode = await this.decodeImage(turnOverImage, params, file.name);
    }
    return decode;
  }
  /* eslint-enable no-undef -- Включение правила no-undef */
}

/* eslint-enable no-unused-vars -- Включение правила no-unused-vars */
