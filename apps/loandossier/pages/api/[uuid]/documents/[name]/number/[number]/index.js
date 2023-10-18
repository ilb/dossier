import nc from 'next-connect';
import FileResponse from '@ilbru/core/src/responses/FileReponse.js';
import DocumentsUsecases from '@ilbru/dossier-core/src/usecases/DocumentsUsecases.js';
import { handle } from '../../../../../../../src/index.js';

export default nc()
  .use((req, res, next) => {
    try {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      );

      if (req.method == 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).end();
      }
    } catch (e) {
      console.log('e', e);
    }
    next();
  })
  .get(handle(DocumentsUsecases, 'getPage', FileResponse))
  .delete(handle(DocumentsUsecases, 'deletePage'));

export const config = {
  api: {
    bodyParser: false,
  },
};
