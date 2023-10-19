import nc from 'next-connect';
import FileResponse from '@ilbru/core/src/responses/FileReponse.js';
import DocumentsUsecases from '@ilbru/dossier-core/src/usecases/DocumentsUsecases.js';
import { handle } from '../../../../../../../../src/index.js';

export default nc()
  .get(handle(DocumentsUsecases, 'getPage', FileResponse))
  .delete(handle(DocumentsUsecases, 'deletePage'));

export const config = {
  api: {
    bodyParser: false,
  },
};
