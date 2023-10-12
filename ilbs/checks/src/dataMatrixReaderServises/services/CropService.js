import { createCanvas, ImageData } from 'canvas';
import Service from '@ilbru/core/src/base/Service.js';

export default class CropService extends Service {
  constructor() {
    super();
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

    const matrix = [0, -1, 0, -1, 5, -1, 0, -1, 0];
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;
    const filteredData = await this.convolutionFilter(imageData, matrix);
    ctx.putImageData(filteredData, 0, 0);

    const imageDataBlackСolorСontrast = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixelsBlackСolorСontrast = imageData.data;

    pixels = this.blackСolorСontrast(pixelsBlackСolorСontrast);
    ctx.putImageData(imageData, 0, 0);

    // раскоментировать если надо увидеть что нарезано
    // const buffer = canvas.toBuffer('image/png');
    // fs.writeFileSync('./' + name, buffer);

    return canvas;
  }

  //контрастируем черный цвет
  async blackСolorСontrast(pixels) {
    for (let i = 0; i < pixels.length; i += 4) {
      const [r, g, b] = pixels.slice(i, i + 3);
      const avg = (r + g + b) / 3;

      if (avg > 127) {
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

  // добавляем резкости
  async convolutionFilter(imageData, matrix) {
    const { width, height, data } = imageData;
    const outputData = new Uint8ClampedArray(data.length);

    for (let i = 0; i < data.length; i += 4) {
      let r = 0,
        g = 0,
        b = 0,
        a = data[i + 3];
      for (let j = 0; j < 9; j++) {
        const row = Math.floor(j / 3);
        const col = j % 3;
        const x = i + (col - 1) * 4 + (row - 1) * width * 4;
        const value = matrix[j];
        r += data[x] * value;
        g += data[x + 1] * value;
        b += data[x + 2] * value;
      }
      outputData[i] = r;
      outputData[i + 1] = g;
      outputData[i + 2] = b;
      outputData[i + 3] = a;
    }

    return new ImageData(outputData, width, height);
  }
}
