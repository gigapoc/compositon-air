import { setUiState } from '../app/uiState.ts';
import type { SpeciesId } from '../config/scene.constants.ts';
import type { ParticlesContent } from '../content/loadParticleContent.ts';
import { getSpeciesContent } from '../content/loadParticleContent.ts';
import { PARTICLE_SELECTED_EVENT, type ParticlePickDetail } from '../interaction/ParticlePicker.ts';

export class ParticleSheet {
  private readonly overlay: HTMLDivElement;
  private readonly panel: HTMLDivElement;
  private readonly titleEl: HTMLHeadingElement;
  private readonly formulaEl: HTMLParagraphElement;
  private readonly proportionEl: HTMLParagraphElement;
  private readonly bodyEl: HTMLParagraphElement;
  private readonly closeButton: HTMLButtonElement;
  private readonly content: ParticlesContent;
  private onSelected: ((event: CustomEvent<ParticlePickDetail>) => void) | null = null;

  constructor(parent: HTMLElement, content: ParticlesContent) {
    this.content = content;

    this.overlay = document.createElement('div');
    this.overlay.className = 'particle-sheet-overlay';
    this.overlay.hidden = true;
    this.overlay.dataset.particleSheet = 'overlay';

    this.panel = document.createElement('div');
    this.panel.className = 'particle-sheet';
    this.panel.dataset.particleSheet = 'panel';
    this.panel.setAttribute('role', 'dialog');
    this.panel.setAttribute('aria-modal', 'true');
    this.panel.setAttribute('aria-labelledby', 'particle-sheet-title');

    this.titleEl = document.createElement('h2');
    this.titleEl.id = 'particle-sheet-title';
    this.titleEl.className = 'particle-sheet__title';

    this.formulaEl = document.createElement('p');
    this.formulaEl.className = 'particle-sheet__formula';

    this.proportionEl = document.createElement('p');
    this.proportionEl.className = 'particle-sheet__proportion';

    this.bodyEl = document.createElement('p');
    this.bodyEl.className = 'particle-sheet__body';

    this.closeButton = document.createElement('button');
    this.closeButton.type = 'button';
    this.closeButton.className = 'particle-sheet__close';
    this.closeButton.textContent = 'Fermer';
    this.closeButton.addEventListener('click', () => this.close());

    this.panel.append(
      this.titleEl,
      this.formulaEl,
      this.proportionEl,
      this.bodyEl,
      this.closeButton,
    );
    this.overlay.appendChild(this.panel);
    this.overlay.addEventListener('click', (event) => {
      if (event.target === this.overlay) {
        this.close();
      }
    });

    parent.appendChild(this.overlay);

    this.onSelected = (event) => {
      this.open(event.detail.speciesId);
    };
    document.addEventListener(PARTICLE_SELECTED_EVENT, this.onSelected as EventListener);
  }

  open(speciesId: SpeciesId): void {
    const species = getSpeciesContent(this.content, speciesId);
    if (!species) return;

    this.titleEl.textContent = species.name;
    this.formulaEl.textContent = species.formula;
    this.proportionEl.textContent = `Proportion dans l'air : ${species.proportionLabel}`;
    this.bodyEl.textContent = species.body;

    this.overlay.hidden = false;
    setUiState('sheetOpen');
    this.closeButton.focus();
  }

  close(): void {
    this.overlay.hidden = true;
    setUiState('exploring');
  }

  isOpen(): boolean {
    return !this.overlay.hidden;
  }

  dispose(): void {
    if (this.onSelected) {
      document.removeEventListener(PARTICLE_SELECTED_EVENT, this.onSelected as EventListener);
    }
    this.overlay.remove();
  }
}
