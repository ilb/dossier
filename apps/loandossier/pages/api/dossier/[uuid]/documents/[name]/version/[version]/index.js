import nc from 'next-connect';
import DocumentsUsecases from '@ilbru/dossier-core/src/usecases/DocumentsUsecases.js';
import FileResponse from '@ilbru/core/src/responses/FileReponse.js';
import { handle } from '../../../../../../../../src/index.js';

export default nc().get(handle(DocumentsUsecases, 'print', FileResponse));
