import { Rect, Ellipse, Line, Polygon, Canvas as FabricCanvas, IEvent } from 'fabric';
import type { ShapeSettings } from '../../store/toolSettingsStore';

type ShapeType = 'rectangle' | 'ellipse' | 'line' | 'triangle' | 'star' | 'polygon';

export class ShapeTool {
  // ... existing members ...

  setShapeType(type: ShapeType) { this.activeShape = type; }

  private onMouseDown = (opt: IEvent) => {
    if (!this.canvas) return;
    const pointer = this.canvas.getPointer(opt.e);
    this.startPoint = { x: pointer.x, y: pointer.y };

    switch (this.activeShape) {
      case 'rectangle': /* same as before */ break;
      case 'ellipse': /* same */ break;
      case 'line': /* same */ break;
      case 'triangle':
        this.currentObject = new Polygon([
          { x: 0, y: 0 }, { x: 50, y: 100 }, { x: -50, y: 100 }
        ], {
          left: pointer.x, top: pointer.y,
          fill: this.settings.fill,
          stroke: this.settings.stroke,
          strokeWidth: this.settings.strokeWidth,
          originX: 'center', originY: 'center',
        });
        break;
      case 'star':
        // 5-point star path
        const points = createStarPoints(50, 25, 5);
        this.currentObject = new Polygon(points, {
          left: pointer.x, top: pointer.y,
          fill: this.settings.fill,
          stroke: this.settings.stroke,
          strokeWidth: this.settings.strokeWidth,
          originX: 'center', originY: 'center',
        });
        break;
      case 'polygon':
        // default hexagon
        const pts = createPolygonPoints(6, 50);
        this.currentObject = new Polygon(pts, {
          left: pointer.x, top: pointer.y,
          fill: this.settings.fill,
          stroke: this.settings.stroke,
          strokeWidth: this.settings.strokeWidth,
          originX: 'center', originY: 'center',
        });
        break;
    }
    if (this.currentObject) this.canvas.add(this.currentObject);
  };

  // onMouseMove: for triangle/star/polygon, we don't resize with mouse, just place fixed size.
  // But we can scale using mouse position like we do for rect? Simpler: no resize for these; just place at click.
  // So override onMouseMove for these shapes:
  private onMouseMove = (opt: IEvent) => {
    if (!this.canvas || !this.startPoint || !this.currentObject) return;
    if (['triangle','star','polygon'].includes(this.activeShape)) return; // No resize
    // ... existing resize logic for rect/ellipse/line ...
  }

  // onMouseUp finalize
}

function createStarPoints(outerRadius: number, innerRadius: number, points: number) {
  const coords = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    coords.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
  }
  return coords;
}

function createPolygonPoints(sides: number, radius: number) {
  const coords = [];
  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides - Math.PI / 2;
    coords.push({ x: Math.cos(angle) * radius, y: Math.sin(angle) * radius });
  }
  return coords;
}