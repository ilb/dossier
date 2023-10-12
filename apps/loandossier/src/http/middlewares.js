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
});

export const splitPdf = async (req, res, next) => {
  req.files = await req.files?.reduce(async (accumulator, file) => {
    const files = await accumulator;
    if (file.mimetype === 'application/pdf') {
      const poppler = new Poppler(process.env.POPPLER_BIN_PATH);
      const splitOutputPath = `${file.destination}/${file.filename.split('.')[0]}`;
      fs.mkdirSync(splitOutputPath);
      await poppler.pdfToCairo(file.path, `${splitOutputPath}/${file.originalname.split('.')[0]}`, {
        jpegFile: true,
      });
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
};

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
