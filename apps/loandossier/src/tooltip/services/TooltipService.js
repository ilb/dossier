import { TooltipText } from 'src/schemas/constants/TooltipTexts';

export default class TooltipService {
  constructor() {
    this.tooltipUri = '/api/dossier/tooltip';
  }

  getTooltipUrl(type) {
    return `${this.tooltipUri}/${type}`;
  }

  getTooltipByType({ type }) {
    if (type) return TooltipText[type];
  }
}
