import { asValue, asClass } from 'awilix';
import DocumentMerger from './dossier/DocumentMerger.js';
import DossierBuilder from './dossier/DossierBuilder.js';
import DocumentGateway from './gateway/DocumentGateway.js';
import DocumentRepository from './repositories/DocumentRepository.js';
import DocumentVersionRepository from './repositories/DocumentVersionRepository.js';
import DossierRepository from './repositories/DossierRepository.js';
import ErrorRepository from './repositories/ErrorRepository.js';
import PageRepository from './repositories/PageRepository.js';
import VerificationRepository from './repositories/VerificationRepository.js';
import ClassifierGate from './gates/ClassifierGate.js';
import ClassifierGateMock from './gates/ClassifierGateMock.js';
import mockSchema from './schemas/mockSchema.js';
import ClassifyService from './services/ClassifyService.js';
import DocumentsService from './services/DocumentsService.js';
import DossierService from './services/DossierService.js';
import FileService from './services/FileService.js';
import PagesService from './services/PagesService.js';
import VerificationService from './services/VerificationService.js';
import RoleDossierProcessor from './schemas/core/RoleDossierProcessor.js';
import BaseSchemaBuilder from './schemas/core/BaseSchemaBuilder.js';

const registerPackageClasses = (container) => {
  container.register({
    documentMerger: asClass(DocumentMerger),
    dossierBuilder: asClass(DossierBuilder),
    documentGateway: asClass(DocumentGateway),
    documentRepository: asClass(DocumentRepository),
    documentVersionRepository: asClass(DocumentVersionRepository),
    dossierRepository: asClass(DossierRepository),
    errorRepository: asClass(ErrorRepository),
    pageRepository: asClass(PageRepository),
    verificationRepository: asClass(VerificationRepository),
    classifierGate: asClass(
      process.env.CLASSIFIER_GATE_MOCK === 'true' ? ClassifierGate : ClassifierGateMock,
    ),
    dossierSchema: asValue(mockSchema),
    classifyService: asClass(ClassifyService),
    documentsService: asClass(DocumentsService),
    dossierService: asClass(DossierService),
    fileService: asClass(FileService),
    pagesService: asClass(PagesService),
    verificationService: asClass(VerificationService),
    roleDossierProcessor: asClass(RoleDossierProcessor),
    baseSchemaBuilder: asClass(BaseSchemaBuilder),
  });
};

export default registerPackageClasses;
