import { DRAG_THRESHOLD_PX } from '../config/scene.constants.ts';

import type { VirtualJoystick } from '../ui/VirtualJoystick.ts';

export type TouchZone = 'left' | 'right';

export interface LookDragEvent {
  deltaX: number;
  deltaY: number;
}

type LookDragHandler = (event: LookDragEvent) => void;
type TapHandler = (clientX: number, clientY: number) => void;

interface ActivePointer {
  zone: TouchZone;
  startX: number;
  startY: number;
  lastX: number;
  lastY: number;
  isDrag: boolean;
}

export class TouchRouter {
  private readonly element: HTMLElement;
  private readonly pointers = new Map<number, ActivePointer>();
  private onLookDrag: LookDragHandler | null = null;
  private onTap: TapHandler | null = null;
  private joystick: VirtualJoystick | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
    this.element.addEventListener('pointerdown', this.onPointerDown);
    this.element.addEventListener('pointermove', this.onPointerMove);
    this.element.addEventListener('pointerup', this.onPointerUp);
    this.element.addEventListener('pointercancel', this.onPointerUp);
  }

  setLookDragHandler(handler: LookDragHandler | null): void {
    this.onLookDrag = handler;
  }

  setTapHandler(handler: TapHandler | null): void {
    this.onTap = handler;
  }

  setJoystick(joystick: VirtualJoystick | null): void {
    this.joystick = joystick;
  }

  getZone(clientX: number): TouchZone {
    const half = window.innerWidth / 2;
    return clientX < half ? 'left' : 'right';
  }

  dispose(): void {
    this.element.removeEventListener('pointerdown', this.onPointerDown);
    this.element.removeEventListener('pointermove', this.onPointerMove);
    this.element.removeEventListener('pointerup', this.onPointerUp);
    this.element.removeEventListener('pointercancel', this.onPointerUp);
    this.pointers.clear();
  }

  private onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    this.element.setPointerCapture(event.pointerId);
    const zone = this.getZone(event.clientX);
    this.pointers.set(event.pointerId, {
      zone,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      isDrag: false,
    });

    if (zone === 'left') {
      this.joystick?.handlePointerDown(event.clientX, event.clientY, event.pointerId);
    }
  };

  private onPointerMove = (event: PointerEvent): void => {
    const active = this.pointers.get(event.pointerId);
    if (!active) return;

    const dx = event.clientX - active.startX;
    const dy = event.clientY - active.startY;
    if (!active.isDrag && Math.hypot(dx, dy) >= DRAG_THRESHOLD_PX) {
      active.isDrag = true;
    }

    if (active.isDrag && active.zone === 'right' && this.onLookDrag) {
      const deltaX = event.clientX - active.lastX;
      const deltaY = event.clientY - active.lastY;
      this.onLookDrag({ deltaX, deltaY });
    }

    if (active.zone === 'left') {
      this.joystick?.handlePointerMove(event.clientX, event.clientY, event.pointerId);
    }

    active.lastX = event.clientX;
    active.lastY = event.clientY;
  };

  private onPointerUp = (event: PointerEvent): void => {
    const active = this.pointers.get(event.pointerId);
    if (!active) return;

    if (!active.isDrag && this.onTap) {
      this.onTap(event.clientX, event.clientY);
    }

    if (active.zone === 'left') {
      this.joystick?.handlePointerUp(event.pointerId);
    }

    this.pointers.delete(event.pointerId);
    if (this.element.hasPointerCapture(event.pointerId)) {
      this.element.releasePointerCapture(event.pointerId);
    }
  };
}
