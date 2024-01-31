import { setupServer } from 'msw/node';
import signatureDetectorVerification from './signatureDetectorVerification.js';
import classifier from './classifier.js';

const handlers = [
  JSON.parse(process.env['apps.loandossier.stub.signatureDetectorEnabled'])
    ? signatureDetectorVerification
    : [],
  JSON.parse(process.env['apps.loandossier.stub.classifierEnabled']) ? classifier : [],
].flat();

const server = setupServer(...handlers);
server.listen({ onUnhandledRequest: 'bypass' });
