import nc from 'next-connect';
import { handle } from '../../../../src/index.js';
import { splitPdf, uploadMiddleware } from '../../../../src/http/middlewares.js';
import bodyParser from 'body-parser';
import ClassifierUsecases from '@ilbru/dossier-core/src/usecases/ClassifierUsecases.js';

export default nc()
  .use(uploadMiddleware.array('documents'))
  .use(splitPdf)
  .use(bodyParser.json())
  .put(handle(ClassifierUsecases, 'classifyPages'))
  .get(handle(ClassifierUsecases, 'read'));

export const config = {
  api: {
    bodyParser: false,
  },
};
