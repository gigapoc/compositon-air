export interface JoystickOutput {
  x: number;
  y: number;
}

const MAX_RADIUS = 48;

export class VirtualJoystick {
  private readonly container: HTMLElement;
  private readonly base: HTMLDivElement;
  private readonly stick: HTMLDivElement;
  private activePointerId: number | null = null;
  private centerX = 0;
  private centerY = 0;
  private output: JoystickOutput = { x: 0, y: 0 };

  constructor(parent: HTMLElement) {
    this.container = document.createElement('div');
    this.container.className = 'joystick-zone';
    this.base = document.createElement('div');
    this.base.className = 'joystick-base';
    this.stick = document.createElement('div');
    this.stick.className = 'joystick-stick';
    this.base.appendChild(this.stick);
    this.container.appendChild(this.base);
    parent.appendChild(this.container);
    this.base.hidden = true;
  }

  getOutput(): JoystickOutput {
    return this.output;
  }

  handlePointerDown(clientX: number, clientY: number, pointerId: number): void {
    this.activePointerId = pointerId;
    this.centerX = clientX;
    this.centerY = clientY;
    this.base.hidden = false;
    this.base.style.left = `${clientX}px`;
    this.base.style.top = `${clientY}px`;
    this.updateStick(clientX, clientY);
  }

  handlePointerMove(clientX: number, clientY: number, pointerId: number): void {
    if (this.activePointerId !== pointerId) return;
    this.updateStick(clientX, clientY);
  }

  handlePointerUp(pointerId: number): void {
    if (this.activePointerId !== pointerId) return;
    this.activePointerId = null;
    this.base.hidden = true;
    this.output = { x: 0, y: 0 };
    this.stick.style.transform = 'translate(-50%, -50%)';
  }

  dispose(): void {
    this.container.remove();
  }

  private updateStick(clientX: number, clientY: number): void {
    const dx = clientX - this.centerX;
    const dy = clientY - this.centerY;
    const dist = Math.hypot(dx, dy);
    const clamped = dist > MAX_RADIUS ? MAX_RADIUS / dist : 1;
    const nx = dx * clamped;
    const ny = dy * clamped;
    this.stick.style.transform = `translate(calc(-50% + ${nx}px), calc(-50% + ${ny}px))`;
    this.output = {
      x: nx / MAX_RADIUS,
      y: -(ny / MAX_RADIUS),
    };
  }
}
