import { FEATURE_TYPES, type FeatureType } from './types';

export const TYPE_INFO: Record<FeatureType, { label: string; color: string }> = {
  battle: { label: 'Battle', color: '#a4281f' },
  city: { label: 'City or founding', color: '#2c4a66' },
  route: { label: 'Route or waypoint', color: '#8a3b16' },
  boundary: { label: 'Boundary or territory', color: '#55524c' },
  uprising: { label: 'Uprising', color: '#c8641c' },
  economic: { label: 'Economic site', color: '#7b6320' },
  political: { label: 'Political event', color: '#5a3d87' },
};

export const ROUTE_COLOR = TYPE_INFO.route.color;
export const BOUNDARY_COLOR = TYPE_INFO.boundary.color;

const PIXEL_RATIO = 2;
export const ICON_SIZE = 22;

/** Draws the map symbol for a point feature of the given type onto a 2D context of ICON_SIZE × ICON_SIZE. */
function drawSymbol(ctx: CanvasRenderingContext2D, type: FeatureType): void {
  const s = ICON_SIZE;
  const c = s / 2;
  const color = TYPE_INFO[type].color;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const outline = (path: () => void, fill = color) => {
    ctx.beginPath();
    path();
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#fffaf0';
    ctx.stroke();
  };
  switch (type) {
    case 'battle': {
      // crossed swords, reduced to a bold saltire on a disc
      outline(() => ctx.arc(c, c, c - 2, 0, Math.PI * 2));
      ctx.strokeStyle = '#fffaf0';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(c - 4.5, c - 4.5);
      ctx.lineTo(c + 4.5, c + 4.5);
      ctx.moveTo(c + 4.5, c - 4.5);
      ctx.lineTo(c - 4.5, c + 4.5);
      ctx.stroke();
      break;
    }
    case 'city': {
      outline(() => ctx.rect(3, 3, s - 6, s - 6));
      ctx.fillStyle = '#fffaf0';
      ctx.fillRect(c - 2.5, c - 2.5, 5, 5);
      break;
    }
    case 'uprising': {
      outline(() => {
        ctx.moveTo(c, 2);
        ctx.lineTo(s - 2.5, s - 3);
        ctx.lineTo(2.5, s - 3);
      });
      break;
    }
    case 'economic': {
      outline(() => {
        ctx.moveTo(c, 1.5);
        ctx.lineTo(s - 1.5, c);
        ctx.lineTo(c, s - 1.5);
        ctx.lineTo(1.5, c);
      });
      break;
    }
    case 'political': {
      outline(() => {
        for (let k = 0; k < 10; k++) {
          const r = k % 2 ? 4.2 : c - 1.5;
          const a = -Math.PI / 2 + (k * Math.PI) / 5;
          ctx.lineTo(c + r * Math.cos(a), c + r * Math.sin(a) + 0.8);
        }
      });
      break;
    }
    case 'route': {
      outline(() => ctx.arc(c, c, 5, 0, Math.PI * 2));
      break;
    }
    case 'boundary': {
      outline(() => ctx.rect(5, 5, s - 10, s - 10), '#fffaf0');
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(6, 6, s - 12, s - 12);
      break;
    }
  }
}

function canvasFor(type: FeatureType, ratio: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = ICON_SIZE * ratio;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(ratio, ratio);
  drawSymbol(ctx, type);
  return canvas;
}

export function symbolImage(type: FeatureType): ImageData {
  const canvas = canvasFor(type, PIXEL_RATIO);
  return canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height);
}

export const SYMBOL_PIXEL_RATIO = PIXEL_RATIO;

/** Same symbol as a data URL for the legend and sidebar. */
export function symbolDataUrl(type: FeatureType): string {
  return canvasFor(type, PIXEL_RATIO).toDataURL();
}

export function legendTypes() {
  return FEATURE_TYPES.map((t) => ({ type: t, ...TYPE_INFO[t] }));
}
