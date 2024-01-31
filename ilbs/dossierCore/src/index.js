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
import mockSchema from './schemas/mockSchema.js';
import ClassifyService from './services/ClassifyService.js';
import DocumentsService from './services/DocumentsService.js';
import DossierService from './services/DossierService.js';
import FileService from './services/FileService.js';
import PagesService from './services/PagesService.js';
import VerificationService from './services/VerificationService.js';
import BaseSchemaBuilder from './schemas/core/BaseSchemaBuilder.js';
import DocumentErrorGateway from './gateway/DocumentErrorGateway.js';
import DocumentStateService from './services/DocumentStateService.js';
import DocumentErrorService from './services/DocumentErrorService.js';

const registerPackageClasses = (container) => {
  container.register({
    documentMerger: asClass(DocumentMerger),
    dossierBuilder: asClass(DossierBuilder),
    documentGateway: asClass(DocumentGateway),
    documentErrorGateway: asClass(DocumentErrorGateway),
    documentErrorService: asClass(DocumentErrorService),
    documentRepository: asClass(DocumentRepository),
    documentVersionRepository: asClass(DocumentVersionRepository),
    dossierRepository: asClass(DossierRepository),
    errorRepository: asClass(ErrorRepository),
    pageRepository: asClass(PageRepository),
    verificationRepository: asClass(VerificationRepository),
    classifierGate: asClass(ClassifierGate),
    dossierSchema: asValue(mockSchema),
    classifyService: asClass(ClassifyService),
    documentsService: asClass(DocumentsService),
    documentStateService: asClass(DocumentStateService),
    dossierService: asClass(DossierService),
    fileService: asClass(FileService),
    pagesService: asClass(PagesService),
    verificationService: asClass(VerificationService),
    baseSchemaBuilder: asClass(BaseSchemaBuilder),
  });
};

export default registerPackageClasses;
