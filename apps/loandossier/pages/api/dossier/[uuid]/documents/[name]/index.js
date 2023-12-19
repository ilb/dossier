import nc from 'next-connect';
import DocumentsUsecases from '@ilbru/dossier-core/src/usecases/DocumentsUsecases.js';
import FileResponse from '@ilbru/core/src/responses/FileReponse.js';
import bodyParser from 'body-parser';
import { handle, middlewareHandle } from '../../../../../../src/index.js';
import {
  checkEmptyList,
  uploadMiddleware,
  getDossierDate,
  jfifToJpeg,
  splitPdf,
  checkMimeType,
  isFormDataHandler,
} from '@ilbru/dossier-core/src/http/middlewares.js';

export default nc()
  .use(bodyParser.json())
  .use(middlewareHandle(DocumentsUsecases, 'getDate', getDossierDate))
  .use(isFormDataHandler)
  .use(jfifToJpeg)
  .use(splitPdf)
  .use(checkMimeType)
  .use(checkEmptyList)
  .put(handle(DocumentsUsecases, 'update'))
  .get(handle(DocumentsUsecases, 'print', FileResponse));

export const config = {
  api: {
    bodyParser: false,
  },
};
