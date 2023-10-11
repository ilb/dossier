import Service from '@ilb/core/src/base/Service.js';
import { createCanvas } from 'canvas';
// import fs from 'fs';
export default class FlipService extends Service {
  constructor() {
    super();
  }
  async turnOver(img, tiltAngle = 180) {
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    // Рисуем изображение на холсте
    ctx.drawImage(img, 0, 0);

    // Поворот изображения на 180 градусов
    ctx.translate(img.width, img.height);
    let angleInRadians = (tiltAngle * Math.PI) / 180;
    ctx.rotate(angleInRadians);
    ctx.drawImage(img, 0, 0);

    //const buffer = canvas.toBuffer('image/png');
    // fs.writeFileSync('./' + name, buffer);
    return canvas;
  }
}
