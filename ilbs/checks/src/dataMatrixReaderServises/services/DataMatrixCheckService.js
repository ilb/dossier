import Service from '@ilbru/core/src/base/Service.js';
import CropService from './CropService';
import FlipService from './FlipService';
import { loadImage } from 'canvas';
import {
  MultiFormatReader,
  BinaryBitmap,
  HTMLCanvasElementLuminanceSource,
  HybridBinarizer,
} from '@zxing/library';
import { exec } from 'child_process';
import fs from 'fs';

export default class DataMatrixCheckService extends Service {
  constructor() {
    super();
    this.flipService = new FlipService();
    this.cropService = new CropService();
    this.reader = new MultiFormatReader();
  }

  async decodeCanvas(canvas, name) {
    let result;
    try {
      const zXingPromise = this.zXing(canvas.canvas);
      const dmtxReadPromise = this.dmtxRead(canvas.path);
      result = await Promise.race([
        Promise.any([zXingPromise, dmtxReadPromise]),
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('Тайм-аут операции'));
          }, 300);
        }),
      ]);
    } catch (err) {}
    fs.unlink(canvas.path, (error) => {});
    return result;
  }

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

  async zXing(canvas) {
    const luminanceSource = new HTMLCanvasElementLuminanceSource(canvas);
    const bitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
    const hints = new Map();
    const result = await this.reader.decode(bitmap, hints);
    return result.text;
  }

  async decodeImage(image, params, name) {
    let decoded = null;
    for (let param of params) {
      const croppCanvas = await this.cropService.crop(image, param, name);
      decoded = await this.decodeCanvas(croppCanvas, name);
      if (decoded) {
        break;
      }
    }
    return decoded;
  }

  async decodeFile(file, params) {
    const image = await loadImage(file.uri);
    let decode = await this.decodeImage(image, params, file.name);

    if (!decode) {
      const turnOverImage = await this.flipService.turnOver(image);
      decode = await this.decodeImage(turnOverImage, params, file.name);
    }
    return decode;
  }
}
