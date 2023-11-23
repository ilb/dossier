import nc from 'next-connect';
import { handle } from '../../../src/index.js';
import SchemasUsecases from '@ilbru/dossier-core/src/usecases/SchemasUsecases.js';

export default nc().post(handle(SchemasUsecases, 'read'));
