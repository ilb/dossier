import nc from 'next-connect';
import { handle } from '../../../src/index.js';
import SchemasUsecases from '../../../src/schemas/usecases/SchemasUsecases.js';

export default nc().get(handle(SchemasUsecases, 'read'));
