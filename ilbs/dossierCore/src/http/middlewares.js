/* eslint-disable n/no-missing-import -- Отключение правила n/no-missing-import */
import fs from "fs";
import im from "imagemagick";
import mime from "mime-types";
import multer from "multer";
import { Poppler } from "node-poppler";
import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";

import Errors from "../util/Errors.js";

/* eslint-enable n/no-missing-import -- Отключение правила n/no-missing-import */

export const uploadMiddleware = multer({
  limits: {
    fileSize: process.env["apps.classifier.filesize"]
      ? process.env["apps.classifier.filesize"] * 1024 * 1024
      : 30 * 1024 * 1024,
  },
  storage: multer.diskStorage({
    /**
     * @param {Object} req Объект запроса.
     * @param {Object} file Загруженный файл.
     * @param {Function} cb Callback функция.
     * @returns {void}
     */
    destination(req, file, cb) {
      const date = req?.query?.createdDate?.split(".").reverse().join("/");
      const destination = `documents/dossier/${date}/${req.query.uuid}/${req.query.name}`;

      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }

      return cb(null, destination);
    },
    /**
     * @param {Object} req Объект запроса.
     * @param {Object} file Загруженный файл.
     * @param {Function} cb Callback функция.
     * @returns {void}
     */
    filename(req, file, cb) {
      file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8");
      return cb(null, `${uuidv4()}.${file.originalname.split(".").pop()}`);
    },
  }),
});

/**
 * @param {Object} req Объект запроса.
 * @param {Object} res Объект ответа.
 * @param {Function} next Callback функция.
 * @param {Object} result Результат выполнения запроса.
 * @returns {void}
 */
export const getDossierDate = (req, res, next, result) => {
  req.query = { ...req.query, createdDate: result.createdDate };
  next();
};

/**
 * @param {Object} req Объект запроса.
 * @param {Object} res Объект ответа.
 * @param {Function} next Callback функция.
 * @returns {void}
 */
export const jfifToJpeg = async (req, res, next) => {
  req.files = await req.files?.reduce(async (accumulator, file) => {
    const files = await accumulator;

    /* eslint-disable require-unicode-regexp -- Отключение правила require-unicode-regexp */
    if (/\.jfif$/.test(file.originalname)) {
      const jpegOutput = `${file.destination}/${file.filename.split(".")[0]}.jpg`;

      fs.renameSync(file.path, jpegOutput);
      return [
        ...files,
        {
          ...file,
          originalname: file.originalname.replace(".jfif", ".jpg"),
          filename: file.filename.replace(".jfif", ".jpg"),
          path: jpegOutput,
        },
      ];
    }
    /* eslint-enable require-unicode-regexp -- Включение правила require-unicode-regexp */
    return [...files, file];

  }, []);
  next();
};

/**
 * @param {Object} req Объект запроса.
 * @param {Object} res Объект ответа.
 * @param {Function} next Callback функция.
 * @returns {void}
 */
export const checkMimeType = async (req, res, next) => {
  req.files = await req.files?.reduce(async (accumulator, file) => {
    const files = await accumulator;
    const firstPageMimeType = mime.lookup(file.path);

    // Тут можно обработать не нужные mimetype
    if (!firstPageMimeType) {
      const destinationPath = `${file.destination}/errorDocument/${file.filename}`;
      const sourcePath = file.path;

      // Создаем новую папку
      fs.mkdir(`${file.destination}/errorDocument`, { recursive: true }, () => {
        // Переносим исходный фаил
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

/* eslint-disable n/callback-return -- Отключение правила n/callback-return */
/**
 * @param {Object} req Объект запроса.
 * @param {Object} res Объект ответа.
 * @param {Function} next Callback функция.
 * @returns {void}
 */
export const splitPdf = async (req, res, next) => {
  try {
    req.files = await req.files?.reduce(async (accumulator, file) => {
      const files = await accumulator;

      if (file.mimetype === "application/pdf") {
        const poppler = new Poppler(process.env["apps.loandossier.poppler_bin_path"]);
        const splitOutputPath = `${file.destination}/${file.filename.split(".")[0]}`;

        fs.mkdirSync(splitOutputPath);
        await poppler.pdfToCairo(
          file.path,
          `${splitOutputPath}/${file.originalname.split(".")[0]}`,
          {
            jpegFile: true,
          },
        );
        let pages = fs.readdirSync(splitOutputPath);

        pages = pages.map(page => {
          const filename = `${uuidv4()}.jpg`;
          const path = `${file.destination}/${filename}`;

          fs.renameSync(`${splitOutputPath}/${page}`, path);

          return { path, filename, mimetype: "image/jpeg" };
        });

        fs.unlinkSync(file.path);
        fs.rmdirSync(splitOutputPath);

        return [...files, ...pages];
      }
      return [...files, file];

    }, []);
    next();
    /* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
  } catch (e) {
    throw new Error("Ошибка разбиения pdf");
  }
  /* eslint-enable no-unused-vars -- Отключение правила no-unused-vars */
};
/* eslint-enable n/callback-return -- Отключение правила n/callback-return */

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

/* eslint-disable n/callback-return -- Отключение правила n/callback-return */
/**
 * @param {Object} req Объект запроса.
 * @param {Object} res Объект ответа.
 * @param {Function} next Callback функция.
 * @returns {void}
 */
export const checkEmptyList = async (req, res, next) => {
  try {
    const convert = promisify(im.convert);

    req.files = await req.files?.reduce(async (accumulator, file) => {
      // Задаем параметры для вывода в avr
      const files = await accumulator;

      if (!file.mimetype.includes("image/")) {
        return [...files, file];
      }

      const colorSpace = "sRGB";
      const size = "100x100";
      const format = "%[pixel:u]";
      const outputFormat = "txt";

      const options = [
        file.path,
        "-colorspace",
        colorSpace,
        "-scale",
        size,
        "-depth",
        "8",
        "-format",
        format,
        `${outputFormat}:-`,
      ];

      const result = await convert(options);

      const lines = result.trim().split("\n").slice(1);
      // разбить текст на объект для удобной работы с ним
      const objectsAvg = lines.map(line => {
        const [xy, color] = line.split(": ");
        const [x, y] = xy.split(",");
        const [rgb, hex, name] = color.split("  ");

        return {
          x: parseInt(x, 10),
          y: parseInt(y, 10),
          color: {
            r: parseInt(rgb.slice(1, 4), 10),
            g: parseInt(rgb.slice(5, 8), 10),
            b: parseInt(rgb.slice(9, 12), 10),
            name,
            hex,
          },
        };
      });

      const counters = {};
      let maxCount = 0;

      // получить количество цвета в %
      for (const obj of objectsAvg) {
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
      }
      return [...files, file];

    }, []);
    next();
  } catch (e) {
    /* eslint-disable no-restricted-syntax -- Отключение правила no-restricted-syntax */
    console.log("e", e);
    /* eslint-enable no-restricted-syntax -- Отключение правила no-restricted-syntax */
    throw new Error("Ошибка проверки на белый лист");
  }
};
/* eslint-enable n/callback-return -- Отключение правила n/callback-return */
