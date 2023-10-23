import nc from 'next-connect';
import { handle, middlewareHandle } from '../../../../src/index.js';
import {
  getDossierDate,
  jfifToJpeg,
  splitPdf,
  uploadMiddleware,
} from '../../../../src/http/middlewares.js';
import bodyParser from 'body-parser';
import ClassifierUsecases from '@ilbru/dossier-core/src/usecases/ClassifierUsecases.js';
import DocumentsUsecases from '@ilbru/dossier-core/src/usecases/DocumentsUsecases.js';

export default nc()
  .use(middlewareHandle(DocumentsUsecases, 'getDate', getDossierDate))
  .use(uploadMiddleware.array('documents'))
  .use(jfifToJpeg)
  .use(splitPdf)
  .use(bodyParser.json())
  .put(handle(ClassifierUsecases, 'classifyPages'))
  .get(handle(ClassifierUsecases, 'read'));

export const config = {
  api: {
    bodyParser: false,
  },
};
