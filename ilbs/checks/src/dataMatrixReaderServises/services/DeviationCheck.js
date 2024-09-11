/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */

import Service from "@ilb/core/src/base/Service.js";
import { Image } from "image-js";

export default class DeviationCheck extends Service {
  /**
   * @param {Object} root0 Объект с параметрами.
   * @param {Object} root0.flipService Сервис для переворота изображений.
   */
  constructor({ flipService }) {
    super();
    this.flipService = flipService;
  }
  /**
   * Проверяет изображение на отклонение и выравнивает его.
   * @param {Buffer|string} img Изображение для обработки.
   * @param {string} name Имя изображения (не используется).
   * @returns {Promise<Image>} - Возвращает выровненное изображение.
   */
  async check(img, name) {
    // Преобразование в оттенки серого и применение фильтра Canny
    const image = await Image.load(img);
    const gray = image.clone().grey();
    const edges = gray.canny({
      lowThreshold: 20,
      highThreshold: 50,
    });

    // Поиск контура
    const contours = edges.findContours({
      mode: "outer",
    });
    const contour = contours.sort((c1, c2) => c2.area - c1.area)[0];

    // Определение угла наклона
    const rect = contour.rotatedRect();
    const angle = rect.angle;

    // Поворот изображения
    const aligned = image.clone().rotate(angle);

    // Обрезка черных полей
    const x = rect.center.x - rect.size.width / 2;
    const y = rect.center.y - rect.size.height / 2;
    const width = rect.size.width;
    const height = rect.size.height;
    const cropped = aligned.crop(x, y, width, height);

    // Возвращаем выравненное изображение
    return cropped;
  }

  /* eslint-disable no-undef -- Отключение правила no-undef */
  /**
   * Выравнивает изображение, загруженное по пути.
   * @param {string} imagePath Путь к изображению.
   * @returns {Promise<Image>} - Возвращает выровненное изображение.
   */
  static async alignScanFromPath(imagePath) {
    // Загрузка изображения
    const image = await load(imagePath); // forStas 'load' is not defined no-undef

    // Выравнивание скана
    const aligned = await ScannerAlignment.alignScan(image); // forStas 'ScannerAlignment' is not defined  no-undef

    // Возвращаем выравненное изображение
    return aligned;
  }
}
/* eslint-enable no-undef -- Отключение правила no-undef */
/* eslint-enable no-unused-vars -- Отключение правила no-unused-vars */
