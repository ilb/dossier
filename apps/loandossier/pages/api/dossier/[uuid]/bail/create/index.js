import nc from 'next-connect';
import { handle } from '../../../../../../src/index.js';
import BailUsecase from '../../../../../../src/bail/usecases/BailUsecase.js';

export default nc().post(handle(BailUsecase, 'create'));
