import nc from 'next-connect';
import { handle, middlewareHandle } from '../../../../src/index.js';
import {
  checkEmptyList,
  uploadMiddleware,
  getDossierDate,
  jfifToJpeg,
  splitPdf,
  checkMimeType,
} from '@ilbru/dossier-core/src/http/middlewares.js';
import bodyParser from 'body-parser';
import ClassifierUsecases from '@ilbru/dossier-core/src/usecases/ClassifierUsecases.js';
import DocumentsUsecases from '@ilbru/dossier-core/src/usecases/DocumentsUsecases.js';

export default nc()
  .use(async (req, res, next) => {
    if (req.method !== 'GET') {
      await middlewareHandle(DocumentsUsecases, 'getDate', getDossierDate)(req, res, next);
    } else next();
  })
  .use(uploadMiddleware.array('documents'))
  .use(jfifToJpeg)
  .use(splitPdf)
  .use(checkMimeType)
  .use(checkEmptyList)
  .use(bodyParser.json())
  .put(handle(ClassifierUsecases, 'classifyPages'))
  .get(handle(ClassifierUsecases, 'read'));

export const config = {
  api: {
    bodyParser: false,
  },
};
