/* eslint-disable n/no-extraneous-import -- Отключение правила n/no-extraneous-import */
/* eslint-disable iconicompany/avoid-naming -- Отключение правила iconicompany/avoid-naming */
import Service from "@ilb/core/src/base/Service.js";
// import { createCanvas, ImageData } from 'canvas';
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export default class CropService extends Service {
  /**
   * Конструктор службы обрезки изображений.
   */
  constructor() {
    super();
    this.destination = "./verificationsDocuments/dtmxReader/";
  }
  /* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
  /* eslint-disable no-undef -- Отключение правила no-undef */
  /**
   * Обрезает изображение и сохраняет его.
   * @param {Object} img Исходное изображение.
   * @param {Object} cropped Область обрезки с координатами.
   * @param {string} name Имя файла.
   * @returns {Promise<Object>} - Объект с canvas и путем сохраненного изображения.
   */
  async crop(img, cropped, name) {

    const canvas = createCanvas("canvas");

    canvas.width = cropped.width * 2.5;
    canvas.height = cropped.height * 2.5;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0);

    ctx.drawImage(
      img,
      cropped.sx,
      cropped.sy,
      cropped.width,
      cropped.height,
      0,
      0,
      canvas.width,
      canvas.height,
    );

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const avg = this.findDominantColor(imageData.data);


    const imageDataBlackСolorСontrast = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixelsBlackСolorСontrast = imageData.data;
    const pixels = this.blackСolorСontrast(pixelsBlackСolorСontrast, avg);

    ctx.putImageData(imageData, 0, 0);

    if (!fs.existsSync(this.destination)) {
      fs.mkdirSync(this.destination, { recursive: true });
    }

    const path = `${this.destination + uuidv4()}.png`;
    const buffer = canvas.toBuffer("image/png");

    fs.writeFileSync(path, buffer);

    return { canvas, path };

  }
  /* eslint-enable no-unused-vars -- Включение правила no-unused-vars */
  /* eslint-enable no-undef -- Отключение правила no-undef */
  /**
   * Находит доминирующий цвет в изображении.
   * @param {Uint8ClampedArray} imageData Массив данных пикселей.
   * @returns {number} - Средний цвет изображения.
   */
  findDominantColor(imageData) {
    const colorCounts = {};

    for (let i = 0; i < imageData.length; i += 4) {
      const [r, g, b] = imageData.slice(i, i + 3);
      const rgb = `${r},${g},${b}`;

      if (colorCounts[rgb]) {
        colorCounts[rgb]++;
      } else {
        colorCounts[rgb] = 1;
      }
    }

    let dominantColor;
    let maxCount = 0;

    for (const color in colorCounts) {
      if (colorCounts[color] > maxCount) {
        dominantColor = color;
        maxCount = colorCounts[color];
      }
    }

    const numbers = dominantColor.match(/\d+/g); // eslint-disable-line require-unicode-regexp -- Отключение ошибки require-unicode-regexp
    let avg = 0;

    for (let i = 0; i < numbers.length; i++) {
      avg += parseInt(numbers[i], 10);
    }

    return avg / 5;
  }

  /**
   * Применяет контрастирование черного цвета.
   * @param {Uint8ClampedArray} pixels Массив пикселей.
   * @param {number} avgBg Среднее значение фона.
   * @returns {Uint8ClampedArray} - Массив пикселей с примененным контрастом.
   */
  async blackСolorСontrast(pixels, avgBg) {
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = pixels.slice(i, i + 3);
      const avg = (r + g + b) / 3;

      if (avg > Math.round(avgBg)) {
        pixels[i] = 255;
        pixels[i + 1] = 255;
        pixels[i + 2] = 255;
      } else {
        pixels[i] = 0;
        pixels[i + 1] = 0;
        pixels[i + 2] = 0;
      }
    }
    return pixels;
  }
}
/* eslint-enable iconicompany/avoid-naming -- Включение правила iconicompany/avoid-naming */
/* eslint-enable n/no-extraneous-import -- Выключение правила n/no-extraneous-import */
