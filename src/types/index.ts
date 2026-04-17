// ─────────────────────────────────────────────
//  @usamadev/google-maps-react  –  types
// ─────────────────────────────────────────────

export type MapTypeId = 'roadmap' | 'satellite' | 'hybrid' | 'terrain';

export type ControlPosition =
  | 'TOP_LEFT'
  | 'TOP_CENTER'
  | 'TOP_RIGHT'
  | 'LEFT_TOP'
  | 'LEFT_CENTER'
  | 'LEFT_BOTTOM'
  | 'RIGHT_TOP'
  | 'RIGHT_CENTER'
  | 'RIGHT_BOTTOM'
  | 'BOTTOM_LEFT'
  | 'BOTTOM_CENTER'
  | 'BOTTOM_RIGHT';

/** Options for the zoom control */
export interface ZoomControlOptions {
  /** Show the native Google zoom +/- buttons. @default true */
  show?: boolean;
  position?: ControlPosition;
}

/** Options for the fullscreen control */
export interface FullscreenControlOptions {
  /** Show the native fullscreen button. @default true */
  show?: boolean;
  position?: ControlPosition;
}

/** Options for the map-type (layers) control */
export interface MapTypeControlOptions {
  /** Show the native Map/Satellite/Hybrid/Terrain switcher. @default true */
  show?: boolean;
  position?: ControlPosition;
  /** Which map types to include in the switcher. */
  mapTypeIds?: MapTypeId[];
  /** Visual style of the control. @default 'DROPDOWN_MENU' */
  style?: 'DEFAULT' | 'DROPDOWN_MENU' | 'HORIZONTAL_BAR';
}

/** Options for the street-view (pegman) control */
export interface StreetViewControlOptions {
  /** Show the pegman drag control. @default false */
  show?: boolean;
  position?: ControlPosition;
}

/** Options for the scale bar */
export interface ScaleControlOptions {
  /** Show the scale bar. @default false */
  show?: boolean;
}

/** Options for the rotate/compass control */
export interface RotateControlOptions {
  /** Show the rotate/compass control. @default false */
  show?: boolean;
  position?: ControlPosition;
}

/** Options for the locate-me button */
export interface LocationControlOptions {
  /**
   * Show a "locate me" button that finds and centres on the user's position.
   * @default true
   */
  show?: boolean;
  position?: ControlPosition;
  /** Zoom level applied after locating. @default 16 */
  zoomOnLocate?: number;
  /** Show the translucent accuracy ring around the blue dot. @default true */
  showAccuracyCircle?: boolean;
  /** Keep tracking position after the first fix. @default true */
  watchPosition?: boolean;
  /** Called with the position every time it is updated. */
  onLocate?: (position: GeolocationCoordinates) => void;
  /** Called when the browser denies or fails geolocation. */
  onError?: (error: GeolocationPositionError) => void;
}

/** Coordinates shorthand */
export interface LatLng {
  lat: number;
  lng: number;
}

/** Root props for <GoogleMap /> */
export interface GoogleMapProps {
  /** Your Google Maps JavaScript API key. */
  apiKey: string;

  /** Initial centre of the map. @default { lat: 0, lng: 0 } */
  center?: LatLng;

  /** Initial zoom level. @default 12 */
  zoom?: number;

  /** Default map type. @default 'roadmap' */
  mapTypeId?: MapTypeId;

  /** className applied to the outer wrapper div. */
  className?: string;

  /** Inline style applied to the outer wrapper div. */
  style?: React.CSSProperties;

  // ── Controls ──────────────────────────────
  zoomControl?: boolean | ZoomControlOptions;
  fullscreenControl?: boolean | FullscreenControlOptions;
  mapTypeControl?: boolean | MapTypeControlOptions;
  streetViewControl?: boolean | StreetViewControlOptions;
  scaleControl?: boolean | ScaleControlOptions;
  rotateControl?: boolean | RotateControlOptions;
  locationControl?: boolean | LocationControlOptions;

  // ── Callbacks ─────────────────────────────
  /** Fires once the map instance is ready. */
  onMapLoad?: (map: google.maps.Map) => void;
  /** Fires when the map centre changes. */
  onCenterChange?: (center: LatLng) => void;
  /** Fires when the zoom changes. */
  onZoomChange?: (zoom: number) => void;
  /** Fires when the map type changes. */
  onMapTypeChange?: (mapTypeId: MapTypeId) => void;
}
