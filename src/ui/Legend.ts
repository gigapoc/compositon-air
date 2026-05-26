import {
  COLOR_AR,
  COLOR_CO2_C,
  COLOR_CO2_O,
  COLOR_N2,
  COLOR_O2,
  type SpeciesId,
} from '../config/scene.constants.ts';
import type { ParticlesContent } from '../content/loadParticleContent.ts';

interface LegendVisual {
  shape: string;
  colors: number[];
}

const LEGEND_VISUALS: Record<SpeciesId, LegendVisual> = {
  N2: { shape: 'Deux sphères fusionnées', colors: [COLOR_N2] },
  O2: { shape: 'Deux sphères fusionnées', colors: [COLOR_O2] },
  Ar: { shape: 'Petite sphère isolée', colors: [COLOR_AR] },
  CO2: { shape: 'C + 2 O alignés', colors: [COLOR_CO2_C, COLOR_CO2_O] },
};

function hexColor(value: number): string {
  return `#${value.toString(16).padStart(6, '0')}`;
}

export class Legend {
  private readonly root: HTMLElement;
  private readonly list: HTMLUListElement;
  private readonly toggleButton: HTMLButtonElement;
  private collapsed = true;

  constructor(parent: HTMLElement, content: ParticlesContent) {
    this.root = document.createElement('aside');
    this.root.className = 'legend';
    this.root.setAttribute('aria-label', 'Légende des gaz');

    const header = document.createElement('div');
    header.className = 'legend__header';

    const title = document.createElement('h2');
    title.className = 'legend__title';
    title.textContent = 'Légende';

    this.toggleButton = document.createElement('button');
    this.toggleButton.type = 'button';
    this.toggleButton.className = 'legend__toggle';
    this.toggleButton.setAttribute('aria-controls', 'legend-list');
    this.toggleButton.setAttribute('aria-expanded', 'false');
    this.toggleButton.addEventListener('click', () => this.setCollapsed(!this.collapsed));

    header.append(title, this.toggleButton);
    this.root.appendChild(header);

    this.list = document.createElement('ul');
    this.list.id = 'legend-list';
    this.list.className = 'legend__list';

    for (const species of content.species) {
      const visual = LEGEND_VISUALS[species.id];
      const li = document.createElement('li');
      li.className = 'legend__item';

      const swatches = document.createElement('span');
      swatches.className = 'legend__swatches';
      swatches.setAttribute('aria-hidden', 'true');
      for (const color of visual.colors) {
        const swatch = document.createElement('span');
        swatch.className = 'legend__swatch';
        swatch.style.backgroundColor = hexColor(color);
        swatches.appendChild(swatch);
      }

      const text = document.createElement('span');
      text.className = 'legend__text';
      text.innerHTML =
        `<strong>${species.formula}</strong> — ${species.name}<br>` +
        `<span class="legend__proportion">${species.proportionLabel} de l'air</span><br>` +
        `<span class="legend__shape">${visual.shape}</span>`;

      li.append(swatches, text);
      this.list.appendChild(li);
    }

    this.root.appendChild(this.list);
    parent.appendChild(this.root);
    this.setCollapsed(true);
  }

  private setCollapsed(value: boolean): void {
    this.collapsed = value;
    this.root.classList.toggle('legend--collapsed', value);
    this.list.hidden = value;
    this.toggleButton.setAttribute('aria-expanded', String(!value));
    this.updateToggleLabel();
  }

  private updateToggleLabel(): void {
    this.toggleButton.textContent = this.collapsed ? 'Afficher' : 'Réduire';
    this.toggleButton.setAttribute(
      'aria-label',
      this.collapsed ? 'Afficher la légende des gaz' : 'Réduire la légende des gaz',
    );
  }

  dispose(): void {
    this.root.remove();
  }
}
