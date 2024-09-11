/* eslint-disable no-unused-vars -- Отключение правила no-unused-vars */
/* eslint-disable n/no-extraneous-import -- Отключение правила n/no-extraneous-import */
import { asClass, asValue } from "awilix";

import DocumentMerger from "./dossier/DocumentMerger.js";
import DossierBuilder from "./dossier/DossierBuilder.js";
import ClassifierGate from "./gates/ClassifierGate.js";
import DocumentErrorGateway from "./gateway/DocumentErrorGateway.js";
import DocumentGateway from "./gateway/DocumentGateway.js";
import DocumentRepository from "./repositories/DocumentRepository.js";
import DocumentVersionRepository from "./repositories/DocumentVersionRepository.js";
import DossierRepository from "./repositories/DossierRepository.js";
import ErrorRepository from "./repositories/ErrorRepository.js";
import PageRepository from "./repositories/PageRepository.js";
import VerificationRepository from "./repositories/VerificationRepository.js";
import BaseSchemaBuilder from "./schemas/core/BaseSchemaBuilder.js";
import ClassifyService from "./services/ClassifyService.js";
import DocumentErrorService from "./services/DocumentErrorService.js";
import DocumentsService from "./services/DocumentsService.js";
import DocumentStateService from "./services/DocumentStateService.js";
import DossierService from "./services/DossierService.js";
import FileService from "./services/FileService.js";
import PagesService from "./services/PagesService.js";
import VerificationService from "./services/VerificationService.js";
/* eslint-enable n/no-extraneous-import -- Отключение правила n/no-extraneous-import */


/**
 * Регистрирует классы пакета в контейнере.
 * @param {Object} container Контейнер для регистрации зависимостей.
 * @returns {void} - Функция не возвращает значение.
 */
const registerPackageClasses = container => {
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
/* eslint-enable no-unused-vars -- Отключение правила no-unused-vars */
