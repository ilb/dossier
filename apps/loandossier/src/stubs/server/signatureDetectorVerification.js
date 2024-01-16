import path from 'path';
import { http } from 'msw';
import { stubResponse } from 'msw-symlinked';

const stubPath = path.resolve(process.env['apps.loandossier.stub.root'] + '/signatureDetector');

export default [
  http.post(RegExp(`/documentsignaturedetectorjs`), () => stubResponse(`${stubPath}/verification`)),
];
