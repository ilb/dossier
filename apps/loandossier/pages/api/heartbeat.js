import nc from 'next-connect';
import { handle } from '../../src/index.js';
import HeartbeatResponse from '../../src/core/responses/HeartbeatResponse.js';
import HeartbeatUsecase from '../../src/heartbeat/usecases/HeartbeatUsecase.js';

export default nc().get(handle(HeartbeatUsecase, 'index', HeartbeatResponse));
