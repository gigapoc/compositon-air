import {
  COLOR_AR,
  COLOR_CO2_C,
  COLOR_CO2_O,
  COLOR_N2,
  COLOR_O2,
} from '../config/scene.constants.ts';

interface LegendItem {
  label: string;
  formula: string;
  shape: string;
  colors: number[];
}

const LEGEND_ITEMS: LegendItem[] = [
  {
    label: 'Diazote',
    formula: 'N₂',
    shape: 'Deux sphères fusionnées',
    colors: [COLOR_N2],
  },
  {
    label: 'Dioxygène',
    formula: 'O₂',
    shape: 'Deux sphères fusionnées',
    colors: [COLOR_O2],
  },
  {
    label: 'Argon',
    formula: 'Ar',
    shape: 'Petite sphère isolée',
    colors: [COLOR_AR],
  },
  {
    label: 'Dioxyde de carbone',
    formula: 'CO₂',
    shape: 'C + 2 O alignés',
    colors: [COLOR_CO2_C, COLOR_CO2_O],
  },
];

function hexColor(value: number): string {
  return `#${value.toString(16).padStart(6, '0')}`;
}

export class Legend {
  private readonly root: HTMLElement;

  constructor(parent: HTMLElement) {
    this.root = document.createElement('aside');
    this.root.className = 'legend';
    this.root.setAttribute('aria-label', 'Légende des gaz');

    const title = document.createElement('h2');
    title.className = 'legend__title';
    title.textContent = 'Légende';
    this.root.appendChild(title);

    const list = document.createElement('ul');
    list.className = 'legend__list';

    for (const item of LEGEND_ITEMS) {
      const li = document.createElement('li');
      li.className = 'legend__item';

      const swatches = document.createElement('span');
      swatches.className = 'legend__swatches';
      swatches.setAttribute('aria-hidden', 'true');
      for (const color of item.colors) {
        const swatch = document.createElement('span');
        swatch.className = 'legend__swatch';
        swatch.style.backgroundColor = hexColor(color);
        swatches.appendChild(swatch);
      }

      const text = document.createElement('span');
      text.className = 'legend__text';
      text.innerHTML = `<strong>${item.formula}</strong> — ${item.label}<br><span class="legend__shape">${item.shape}</span>`;

      li.append(swatches, text);
      list.appendChild(li);
    }

    this.root.appendChild(list);
    parent.appendChild(this.root);
  }

  dispose(): void {
    this.root.remove();
  }
}
