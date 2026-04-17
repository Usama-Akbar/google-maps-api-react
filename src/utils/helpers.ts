import type { ControlPosition, MapTypeId } from '../types';

export function resolvePosition(
  pos: ControlPosition | undefined,
  fallback: google.maps.ControlPosition
): google.maps.ControlPosition {
  if (!pos) return fallback;
  return (google.maps.ControlPosition as any)[pos] ?? fallback;
}

export function resolveMapTypeIds(
  ids: MapTypeId[] | undefined
): google.maps.MapTypeId[] {
  const map: Record<MapTypeId, google.maps.MapTypeId> = {
    roadmap:   google.maps.MapTypeId.ROADMAP,
    satellite: google.maps.MapTypeId.SATELLITE,
    hybrid:    google.maps.MapTypeId.HYBRID,
    terrain:   google.maps.MapTypeId.TERRAIN,
  };
  return (ids ?? ['roadmap', 'satellite', 'hybrid', 'terrain']).map((id) => map[id]);
}

export function resolveMapTypeControlStyle(
  style: 'DEFAULT' | 'DROPDOWN_MENU' | 'HORIZONTAL_BAR' | undefined
): google.maps.MapTypeControlStyle {
  if (style === 'HORIZONTAL_BAR') return google.maps.MapTypeControlStyle.HORIZONTAL_BAR;
  if (style === 'DEFAULT')        return google.maps.MapTypeControlStyle.DEFAULT;
  return google.maps.MapTypeControlStyle.DROPDOWN_MENU;
}

/** Normalise boolean | options → options object */
export function normalise<T extends object>(
  value: boolean | T | undefined,
  defaults: T
): { show: boolean } & T {
  if (value === false) return { show: false, ...defaults };
  if (value === true || value === undefined) return { show: true, ...defaults };
  return { show: true, ...defaults, ...value };
}
