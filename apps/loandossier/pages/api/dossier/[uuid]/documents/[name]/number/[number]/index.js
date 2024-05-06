import nc from 'next-connect';
import FileResponse from '../../../../../../../../src/core/responses/FileResponse.js';
import DocumentsUsecases from '@ilbru/dossier-core/src/usecases/DocumentsUsecases.js';
import { handle } from '../../../../../../../../src/index.js';
import corsMiddleware from '../../../../../../middleware/cors.js';

export default nc()
  .use(corsMiddleware)
  .get(handle(DocumentsUsecases, 'getPage', FileResponse))
  .delete(handle(DocumentsUsecases, 'deletePage'));

export const config = {
  api: {
    bodyParser: false,
  },
};
