import nc from 'next-connect';
import DocumentsUsecases from '@ilbru/dossier-core/src/usecases/DocumentsUsecases.js';
import { handle } from '../../../../../../../src/index.js';
import corsMiddleware from '../../../../../middleware/cors.js';

export default nc().use(corsMiddleware).put(handle(DocumentsUsecases, 'changeState'));

export const config = {
  api: {
    bodyParser: false,
  },
};
