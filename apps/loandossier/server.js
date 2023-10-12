import http from 'http';
import nc from 'next-connect';
import bodyParser from 'body-parser';
import { handle } from './src/index.js';
// import SchemasUsecases from './src/usecases/SchemasUsecases.js';
import FileResponse from '@ilbru/core/src/responses/FileReponse.js';
import { uploadMiddleware } from './src/http/middlewares.js';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { splitPdf } from './src/http/middlewares.js';
import DocumentsUsecases from '@ilbru/dossier-core/src/usecases/DocumentsUsecases.js';
import ClassifierUsecases from '@ilbru/dossier-core/src/usecases/ClassifierUsecases.js';

dotenv.config();

const handler = nc({ attachParams: true })
  .use(cors())
  .use(
    '/loandossier/dossiercore/api',
    nc({ attachParams: true })
      .use(uploadMiddleware.array('documents'))
      .use(splitPdf)
      .use(bodyParser.json())
      .get('/:uuid/documents', handle(DocumentsUsecases, 'list'))
      .put('/:uuid/documents/:name', handle(DocumentsUsecases, 'update'))
      .get('/:uuid/documents/:name/:number', handle(DocumentsUsecases, 'getPage', FileResponse))
      .post('/:uuid/documents/correction', handle(DocumentsUsecases, 'correctPages'))
      .delete('/:uuid/documents/:name/:pageUuid', handle(DocumentsUsecases, 'deletePage'))
      .get('/:uuid/documents/:name', handle(DocumentsUsecases, 'print', FileResponse))
      .get(
        '/:uuid/documents/:name/version/:version',
        handle(DocumentsUsecases, 'print', FileResponse),
      ),
    // .get('/schema', handle(SchemasUsecases, 'read')),
  )
  .use(
    '/loandossier/classifier/api',
    nc({ attachParams: true })
      .use(uploadMiddleware.array('documents'))
      .use(bodyParser.json())
      .put('/:uuid', handle(ClassifierUsecases, 'classifyPages'))
      .get('/:uuid', handle(ClassifierUsecases, 'read')),
  );

const port = process.env['HTTP_PORT'] || 3001;

http.createServer(handler).listen(port);
