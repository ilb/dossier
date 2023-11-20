import nc from 'next-connect';
import { handle } from '../../../../../src/index.js';
import TooltipUsecases from '../../../../../src/tooltip/usecases/TooltipUsecases.js';

export default nc().get(handle(TooltipUsecases, 'read'));
