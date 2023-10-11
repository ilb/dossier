import { loadImage } from 'canvas';
import Service from '@ilb/core/src/base/Service.js';
import {
  MultiFormatReader,
  BinaryBitmap,
  HTMLCanvasElementLuminanceSource,
  GlobalHistogramBinarizer,
} from '@zxing/library';
import CropService from './CropService';
import FlipService from './FlipService';
import DeviationCheck from './DeviationCheck';

export default class DataMatrixCheckService extends Service {
  constructor() {
    super();
    this.flipService = new FlipService();
    this.deviationCheck = new DeviationCheck({ flipService });
    this.cropService = new CropService();
    this.reader = new MultiFormatReader();
  }

  async decodeCanvas(canvas, name) {
    //  расшифровываем Матрицу Данных
    const luminanceSource = new HTMLCanvasElementLuminanceSource(canvas);
    const bitmap = new BinaryBitmap(new GlobalHistogramBinarizer(luminanceSource));
    const hints = new Map();
    const result = await this.reader.decode(bitmap, hints);
    return result.text;
  }

  async decodeImage(image, params, name) {
    let decoded = null;
    for (let param of params) {
      try {
        const croppCanvas = await this.cropService.crop(image, param, name);
        decoded = await this.decodeCanvas(croppCanvas, name);
        break;
      } catch (err) {
        // если не найден dmtx то начнет спамить
        // console.log(err);
      }
    }
    return decoded;
  }

  async decodeFile(file, params) {
    const image = await loadImage(file.uri);
    let decode = await this.decodeImage(image, params, file.name);
    //this.deviationCheck.check(file.uri, file.name);
    if (!decode) {
      const turnOverImage = await this.flipService.turnOver(image);
      decode = await this.decodeImage(turnOverImage, params, file.name);
    }
    return decode;
  }
}
