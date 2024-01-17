import path from 'path';
import { rest } from 'msw';
import { stubResponse } from 'msw-symlinked';

const stubPath = path.resolve(process.env['apps.loandossier.stub.root'] + '/classifier');

export default [rest.post(RegExp(`/classify`), () => stubResponse(`${stubPath}/classify`))];
