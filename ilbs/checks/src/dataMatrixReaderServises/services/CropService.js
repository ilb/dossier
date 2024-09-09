import Service from '@ilb/core/src/base/Service.js';
// import { createCanvas, ImageData } from 'canvas';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export default class CropService extends Service {
  constructor() {
    super();
    this.destination = './verificationsDocuments/dtmxReader/';
  }
  async crop(img, cropped, name) {
    // Устанавливаем размеры нового canvas и рисуем его
    const canvas = createCanvas('canvas');
    canvas.width = cropped.width * 2.5;
    canvas.height = cropped.height * 2.5;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // Используем метод `getImageData` для получения данных пикселей изображения:
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
    let pixelsBlackСolorСontrast = imageData.data;

    let pixels = this.blackСolorСontrast(pixelsBlackСolorСontrast, avg);
    ctx.putImageData(imageData, 0, 0);
    if (!fs.existsSync(this.destination)) {
      fs.mkdirSync(this.destination, { recursive: true });
    }
    const path = this.destination + uuidv4() + '.png';

    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path, buffer);

    return { canvas, path };
  }

  findDominantColor(imageData) {
    // Создаем объект для хранения количества пикселей каждого цвета
    const colorCounts = {};
    // Итерируем через все пиксели изображения
    for (let i = 0; i < imageData.length; i += 4) {
      const [r, g, b] = imageData.slice(i, i + 3);
      const rgb = `${r},${g},${b}`;

      // Увеличиваем счетчик для цвета
      if (colorCounts[rgb]) {
        colorCounts[rgb]++;
      } else {
        colorCounts[rgb] = 1;
      }
    }

    // Находим цвет с наибольшим количеством пикселей
    let dominantColor;
    let maxCount = 0;

    for (const color in colorCounts) {
      if (colorCounts[color] > maxCount) {
        dominantColor = color;
        maxCount = colorCounts[color];
      }
    }
    const numbers = dominantColor.match(/\d+/g);
    let avg = 0;
    for (let i = 0; i < numbers.length; i++) {
      avg += parseInt(numbers[i]); // Суммируем числа, предварительно преобразовав их в числовой формат с помощью parseInt()
    }
    // Возвращаем наиболее часто встречающийся цвет
    return avg / 5;
  }

  //контрастируем черный цвет
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
