import Service from '@ilb/core/src/base/Service.js';
import { Image } from 'image-js';

export default class DeviationCheck extends Service {
  constructor({ flipService }) {
    super();
    this.flipService = flipService;
  }
  async check(img, name) {
    // Преобразование в оттенки серого и применение фильтра Canny
    let image = await Image.load(img);
    const gray = image.clone().grey();
    const edges = gray.canny({
      lowThreshold: 20,
      highThreshold: 50,
    });

    // Поиск контура
    const contours = edges.findContours({
      mode: 'outer',
    });
    const contour = contours.sort((c1, c2) => {
      return c2.area - c1.area;
    })[0];

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

  static async alignScanFromPath(imagePath) {
    // Загрузка изображения
    const image = await load(imagePath);

    // Выравнивание скана
    const aligned = await ScannerAlignment.alignScan(image);

    // Возвращаем выравненное изображение
    return aligned;
  }
}
