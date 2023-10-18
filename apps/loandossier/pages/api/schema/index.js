import nc from 'next-connect';
import SchemasUsecases from '@ilbru/dossier-core/src/usecases/SchemasUsecases.js';
import { handle } from '../../../src/index.js';

export default nc().get(handle(SchemasUsecases, 'read'));
