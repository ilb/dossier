/* eslint-disable no-useless-constructor -- Отключение правила no-useless-constructor */
/* eslint-disable no-undef -- Отключение правила no-undef */

import Service from "@ilb/core/src/base/Service.js";
// import { createCanvas } from 'canvas';
// import fs from 'fs';
export default class FlipService extends Service {
  /**
   * Конструктор класса FlipService.
   */
  constructor() {
    super();
  }
  /**
   * Переворачивает изображение на заданный угол.
   * @param {HTMLImageElement} img Изображение, которое нужно перевернуть.
   * @param {number} [tiltAngle=180] Угол наклона в градусах, по умолчанию 180 градусов.
   * @returns {HTMLCanvasElement} - Возвращает холст с перевёрнутым изображением.
   */
  async turnOver(img, tiltAngle = 180) {
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");

    // Рисуем изображение на холсте
    ctx.drawImage(img, 0, 0);

    // Поворот изображения на 180 градусов
    ctx.translate(img.width, img.height);
    const angleInRadians = (tiltAngle * Math.PI) / 180;

    ctx.rotate(angleInRadians);
    ctx.drawImage(img, 0, 0);

    // const buffer = canvas.toBuffer('image/png');
    // fs.writeFileSync('./' + name, buffer);
    return canvas;
  }
}

/* eslint-enable no-useless-constructor -- Включение правила no-useless-constructor */
/* eslint-enable no-undef -- Включение правила no-undef */
