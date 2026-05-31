import type { AirCompositionContent } from '../content/loadParticleContent.ts';

export class AirComposition {
  private readonly root: HTMLElement;
  private readonly body: HTMLDivElement;
  private readonly toggleButton: HTMLButtonElement;
  private collapsed = true;

  constructor(parent: HTMLElement, content: AirCompositionContent) {
    this.root = document.createElement('aside');
    this.root.className = 'air-composition';
    this.root.setAttribute('aria-label', content.title);

    const header = document.createElement('div');
    header.className = 'air-composition__header';

    const title = document.createElement('h2');
    title.className = 'air-composition__title';
    title.textContent = content.title;

    this.toggleButton = document.createElement('button');
    this.toggleButton.type = 'button';
    this.toggleButton.className = 'air-composition__toggle';
    this.toggleButton.setAttribute('aria-controls', 'air-composition-body');
    this.toggleButton.setAttribute('aria-expanded', 'false');
    this.toggleButton.addEventListener('click', () => this.setCollapsed(!this.collapsed));

    header.append(title, this.toggleButton);
    this.root.appendChild(header);

    this.body = document.createElement('div');
    this.body.id = 'air-composition-body';
    this.body.className = 'air-composition__body';

    for (const paragraph of content.paragraphs) {
      const p = document.createElement('p');
      p.className = 'air-composition__paragraph';
      p.textContent = paragraph;
      this.body.appendChild(p);
    }

    this.root.appendChild(this.body);
    parent.appendChild(this.root);
    this.setCollapsed(true);
  }

  private setCollapsed(value: boolean): void {
    this.collapsed = value;
    this.root.classList.toggle('air-composition--collapsed', value);
    this.body.hidden = value;
    this.toggleButton.setAttribute('aria-expanded', String(!value));
    this.updateToggleLabel();
  }

  private updateToggleLabel(): void {
    this.toggleButton.textContent = this.collapsed ? 'Afficher' : 'Réduire';
    this.toggleButton.setAttribute(
      'aria-label',
      this.collapsed ? 'Afficher la description' : 'Réduire la description',
    );
  }

  dispose(): void {
    this.root.remove();
  }
}
