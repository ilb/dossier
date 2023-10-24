import fs from 'fs';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { Poppler } from 'node-poppler';
// import im from 'imagemagick';
// import { promisify } from 'util';
// import sharp from 'sharp';

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

export const getDossierDate = async (req, res, next, result) => {
  req.query = { ...req.query, createdDate: result.createdDate };
  next();
};

export const jfifToJpeg = async (req, res, next) => {
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
