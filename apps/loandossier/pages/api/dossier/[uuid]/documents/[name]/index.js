import nc from 'next-connect';
import DocumentsUsecases from '@ilbru/dossier-core/src/usecases/DocumentsUsecases.js';
import FileResponse from '@ilbru/core/src/responses/FileReponse.js';
import {
  uploadMiddleware,
  getDossierDate,
  jfifToJpeg,
  splitPdf,
  checkEmptyList,
} from '../../../../../../src/http/middlewares.js';
import bodyParser from 'body-parser';
import { handle, middlewareHandle } from '../../../../../../src/index.js';

export default nc()
  .use(middlewareHandle(DocumentsUsecases, 'getDate', getDossierDate))
  .use(uploadMiddleware.array('documents'))
  .use(jfifToJpeg)
  .use(splitPdf)
  .use(checkEmptyList)
  .use(bodyParser.json())
  .put(handle(DocumentsUsecases, 'update'))
  .get(handle(DocumentsUsecases, 'print', FileResponse));

export const config = {
  api: {
    bodyParser: false,
  },
};
