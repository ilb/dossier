import path from 'path';
import { http } from 'msw';
import { stubResponse } from 'msw-symlinked';

const stubPath = path.resolve(process.env['apps.loandossier.stub.root'] + '/classifier');

export default [
  http.post(RegExp(`http://apps04.broker18.ru:19001/classify`), () =>
    stubResponse(`${stubPath}/classify`),
  ),
];
