import fs from 'fs';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Poppler } from 'node-poppler';
import im from 'imagemagick';
import { promisify } from 'util';
import mime from 'mime-types';
import Errors from '../util/Errors.js';
import JsonContext from '@ilbru/core/src/contexts/JsonContext.js';
import path from 'path';

export const isFormDataHandler = async (req, res, next) => {
  try {
    const context = await JsonContext.build({ req, res });
    if (context.request.buffer) {
      const fileBuffer = Buffer.from(context.request.buffer, 'base64');
      const date = context.request.createdDate?.split('.').reverse().join('/');
      const destination = `documents/dossier/${date}/${context.request.uuid}/${context.request.name}`;
      const filename = `${uuidv4()}.jpg`;
      const filePath = `${destination}/${filename}`;
      const directoryPath = path.dirname(filePath);

      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
      }

      fs.writeFileSync(`./${filePath}`, fileBuffer, 'binary');

      req.files = [
        {
          fieldname: 'documents',
          originalname: '87721.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          destination,
          filename,
          path: filePath,
          size: '36017',
        },
      ];

      next();
    } else {
      uploadMiddleware.array('documents')(req, res, next);
    }
  } catch (e) {
    console.log('e', e);
  }
};

export const uploadMiddleware = multer({
  limits: {
    fileSize: process.env['apps.classifier.filesize']
      ? process.env['apps.classifier.filesize'] * 1024 * 1024
      : 30 * 1024 * 1024,
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const date = req?.query?.createdDate?.split('.').reverse().join('/');
      const destination = `documents/dossier/${date}/${req.query.uuid}/${req.query.name}`;

      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }

      return cb(null, destination);
    },
    filename: (req, file, cb) => {
      return cb(null, uuidv4() + '.' + file.originalname.split('.').pop());
    },
  }),
});

export const getDossierDate = (req, res, next, result) => {
  req.query = { ...req.query, createdDate: result.createdDate };
  next();
};

export const jfifToJpeg = async (req, res, next) => {
  console.log('req.files', req.files);

  req.files = await req.files?.reduce(async (accumulator, file) => {
    const files = await accumulator;
    if (/\.jfif$/.test(file.originalname)) {
      const jpegOutput = `${file.destination}/${file.filename.split('.')[0]}.jpg`;
      fs.renameSync(file.path, jpegOutput);
      return [
        ...files,
        {
          ...file,
          originalname: file.originalname.replace('.jfif', '.jpg'),
          filename: file.filename.replace('.jfif', '.jpg'),
          path: jpegOutput,
        },
      ];
    } else {
      return [...files, file];
    }
  }, []);
  next();
};

export const checkMimeType = async (req, res, next) => {
  req.files = await req.files?.reduce(async (accumulator, file) => {
    const files = await accumulator;
    const firstPageMimeType = mime.lookup(file.path);
    //Тут можно обработать не нужные mimetype
    if (!firstPageMimeType) {
      const destinationPath = `${file.destination}/errorDocument/${file.filename}`;
      const sourcePath = file.path;
      //Создаем новую папку
      fs.mkdir(`${file.destination}/errorDocument`, { recursive: true }, () => {
        //Переносим исходный фаил
        fs.rename(sourcePath, destinationPath, () => {});
      });
      throw Errors.critical(`Возникла проблема с файлом : ${file.filename}`);
    }
    return [...files, file];
  }, []);
  next();
};

// export const jfifToJpegCompact = (uuid, name, file, createdDate) => {
//   const date = createdDate.split('.').reverse().join('/');
//   const dossierPath = `documents/dossier/${date}/${uuid}/${name}`;
//   const filename = `${uuidv4()}.jpg`;
//   const path = `${dossierPath}/${filename}`;
//   fs.writeFileSync(path, file.buffer);
//   return {
//     originalname: file.originalname,
//     encoding: file.encoding,
//     mimetype: file.mimetype,
//     destination: dossierPath,
//     filename,
//     path: `${dossierPath}/${filename}`,
//     size: file.size,
//   };
// };

export const splitPdf = async (req, res, next) => {
  try {
    req.files = await req.files?.reduce(async (accumulator, file) => {
      const files = await accumulator;
      if (file.mimetype === 'application/pdf') {
        const poppler = new Poppler(process.env.POPPLER_BIN_PATH);
        const splitOutputPath = `${file.destination}/${file.filename.split('.')[0]}`;
        fs.mkdirSync(splitOutputPath);
        await poppler.pdfToCairo(
          file.path,
          `${splitOutputPath}/${file.originalname.split('.')[0]}`,
          {
            jpegFile: true,
          },
        );
        let pages = fs.readdirSync(splitOutputPath);

        pages = pages.map((page) => {
          const filename = `${uuidv4()}.jpg`;
          const path = `${file.destination}/${filename}`;
          fs.renameSync(`${splitOutputPath}/${page}`, path);

          return { path, filename, mimetype: 'image/jpeg' };
        });

        fs.unlinkSync(file.path);
        fs.rmdirSync(splitOutputPath);

        return [...files, ...pages];
      } else {
        return [...files, file];
      }
    }, []);
    next();
  } catch (e) {
    throw new Error('Ошибка разбиения pdf');
  }
};

// export const splitPdfCompact = async (uuid, name, file, createdDate) => {
//   try {
//     const poppler = new Poppler();
//     const date = createdDate.split('.').reverse().join('/');
//     const dossierPath = `documents/dossier/${date}/${uuid}/${name}`;
//     if (!fs.existsSync(dossierPath)) {
//       fs.mkdirSync(dossierPath, { recursive: true });
//     }
//     const destination = `${dossierPath}/tmp`;
//     const fileName = `${uuidv4()}.${file.originalname.split('.').pop()}`;
//     const path = `${destination}/${fileName}`;
//     if (!fs.existsSync(destination)) {
//       fs.mkdirSync(destination, { recursive: true });
//     }
//     fs.writeFileSync(path, file.buffer);
//     await poppler.pdfToCairo(path, `${path}`, {
//       jpegFile: true,
//     });
//     fs.unlinkSync(path);
//     let pages = fs.readdirSync(destination);
//     const newPages = [];
//     for (let page of pages) {
//       const filename = `${uuidv4()}.jpg`;
//       fs.renameSync(`${destination}/${page}`, `${dossierPath}/${filename}`);

//       newPages.push({
//         originalname: file.originalname,
//         encoding: file.encoding,
//         mimetype: file.mimetype,
//         destination: dossierPath,
//         filename,
//         path: `${dossierPath}/${filename}`,
//         size: file.size,
//       });
//     }
//     fs.rmdirSync(destination);
//     return newPages;
//   } catch (e) {
//     throw new Error('Ошибка разбиения pdf.');
//   }
// };

// export const convertToJpeg = async (req, res, next) => {
//   const convert = promisify(im.convert);
//   req.files = await req.files?.reduce(async (accumulator, file) => {
//     const files = await accumulator;
//     if (['image/bmp', 'image/tiff', 'image/heic'].includes(file.mimetype)) {
//       const jpegOutput = `${file.destination}/${file.filename.split('.')[0]}.jpg`;
//       await convert([file.path, '-format', 'jpg', jpegOutput]);
//       fs.unlinkSync(file.path);
//       return [
//         ...files,
//         {
//           mimetype: 'image/jpeg',
//           path: jpegOutput,
//         },
//       ];
//     } else {
//       return [...files, file];
//     }
//   }, []);
//   next();
// };

// export const compressImages = async (req, res, next) => {
//   req.files = await req.files?.reduce(async (accumulator, file) => {
//     const files = await accumulator;
//     const processingImage = sharp(file.path);
//     const outputName = `${uuidv4()}.jpg`;
//     const outputPath = `${file.destination}/${outputName}`;
//     await processingImage
//       .toFormat('jpeg')
//       .jpeg({ quality: 80, progressive: true, mozjpeg: true })
//       .toFile(outputPath);
//
//     fs.unlinkSync(file.path);
//     return [...files, { path: outputPath, mimetype: 'image/jpeg', filename: outputName }];
//   }, []);
//   next();
// };

export const checkEmptyList = async (req, res, next) => {
  try {
    const convert = promisify(im.convert);
    req.files = await req.files?.reduce(async (accumulator, file) => {
      // Задаем параметры для вывода в avr
      const files = await accumulator;
      const colorSpace = 'sRGB';
      const size = '100x100';
      const format = '%[pixel:u]';
      const outputFormat = 'txt';

      const options = [
        file.path,
        '-colorspace',
        colorSpace,
        '-scale',
        size,
        '-depth',
        '8',
        '-format',
        format,
        outputFormat + ':-',
      ];

      const result = await convert(options);

      const lines = result.trim().split('\n').slice(1);
      //разбить текст на объект для удобной работы с ним
      const objectsAvg = lines.map((line) => {
        const [xy, color] = line.split(': ');
        const [x, y] = xy.split(',');
        const [rgb, hex, name] = color.split('  ');

        return {
          x: parseInt(x),
          y: parseInt(y),
          color: {
            r: parseInt(rgb.slice(1, 4)),
            g: parseInt(rgb.slice(5, 8)),
            b: parseInt(rgb.slice(9, 12)),
            name: name,
            hex: hex,
          },
        };
      });

      const counters = {};
      let maxCount = 0;
      // получить количество цвета в %
      for (let obj of objectsAvg) {
        const name = obj.color.name;
        counters[name] = (counters[name] || 0) + 1; // увеличиваем счетчик
        if (counters[name] > maxCount) {
          // обновляем максимальное значение
          maxCount = counters[name];
        }
      }

      const maxCountPercent = maxCount / (objectsAvg.length / 100);

      if (maxCountPercent > 99) {
        fs.unlinkSync(file.path);
        return [...files];
      } else {
        return [...files, file];
      }
    }, []);
    next();
  } catch (e) {
    console.log('e', e);
    throw new Error('Ошибка проверки на белый лист');
  }
};
