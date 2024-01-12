import path from 'path';
import { rest } from 'msw';
import { stubResponse } from 'msw-symlinked';

const stubPath = path.resolve(process.env['apps.loandeal.stub.root'] + '/classifier');

export default [
  rest.post(RegExp(`http://apps04.broker18.ru:19001/classify`), () =>
    stubResponse(`${stubPath}/classify`),
  ),
];
