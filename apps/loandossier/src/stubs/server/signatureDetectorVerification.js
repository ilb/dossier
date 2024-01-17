import path from 'path';
import { rest } from 'msw';
import { stubResponse } from 'msw-symlinked';

const stubPath = path.resolve(process.env['apps.loandossier.stub.root'] + '/signatureDetector');

export default [
  rest.post(RegExp(`/documentsignaturedetectorjs`), () => stubResponse(`${stubPath}/verification`)),
];
