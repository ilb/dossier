import nc from 'next-connect';
import DocumentsUsecases from '@ilbru/dossier-core/src/usecases/DocumentsUsecases.js';
import FileResponse from '@ilbru/core/src/responses/FileReponse.js';
import { uploadMiddleware, splitPdf } from '../../../../../src/http/middlewares.js';
import bodyParser from 'body-parser';
import { handle } from '../../../../../src/index.js';

export default nc()
  .use(uploadMiddleware.array('documents'))
  .use(splitPdf)
  .use(bodyParser.json())
  .put(handle(DocumentsUsecases, 'update'))
  .get(handle(DocumentsUsecases, 'print', FileResponse));

export const config = {
  api: {
    bodyParser: false,
  },
};
