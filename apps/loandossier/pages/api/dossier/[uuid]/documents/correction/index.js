import nc from 'next-connect';
import DocumentsUsecases from '@ilbru/dossier-core/src/usecases/DocumentsUsecases.js';
import { handle } from '../../../../../../src/index.js';

export default nc().post(handle(DocumentsUsecases, 'correctPages'));
