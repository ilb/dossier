import ManagerDossierProcessor from './ManagerDossierProcessor.js';
import AnalystDossierProcessor from './AnalystDossierProcessor.js';

export default class ModesProcessorFactory {
  constructor() {}

  getModeProcessor(schema, context) {
    const { dossierMode } = context;

    switch (dossierMode) {
      case 'manager': {
        return new ManagerDossierProcessor(schema, context);
      }
      case 'analyst': {
        return new AnalystDossierProcessor(schema, context);
      }
      default: {
        return new ManagerDossierProcessor(schema, context);
      }
    }
  }
}
