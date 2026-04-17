import React$1 from 'react';

type MapTypeId = 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
type ControlPosition = 'TOP_LEFT' | 'TOP_CENTER' | 'TOP_RIGHT' | 'LEFT_TOP' | 'LEFT_CENTER' | 'LEFT_BOTTOM' | 'RIGHT_TOP' | 'RIGHT_CENTER' | 'RIGHT_BOTTOM' | 'BOTTOM_LEFT' | 'BOTTOM_CENTER' | 'BOTTOM_RIGHT';
/** Options for the zoom control */
interface ZoomControlOptions {
    /** Show the native Google zoom +/- buttons. @default true */
    show?: boolean;
    position?: ControlPosition;
}
/** Options for the fullscreen control */
interface FullscreenControlOptions {
    /** Show the native fullscreen button. @default true */
    show?: boolean;
    position?: ControlPosition;
}
/** Options for the map-type (layers) control */
interface MapTypeControlOptions {
    /** Show the native Map/Satellite/Hybrid/Terrain switcher. @default true */
    show?: boolean;
    position?: ControlPosition;
    /** Which map types to include in the switcher. */
    mapTypeIds?: MapTypeId[];
    /** Visual style of the control. @default 'DROPDOWN_MENU' */
    style?: 'DEFAULT' | 'DROPDOWN_MENU' | 'HORIZONTAL_BAR';
}
/** Options for the street-view (pegman) control */
interface StreetViewControlOptions {
    /** Show the pegman drag control. @default false */
    show?: boolean;
    position?: ControlPosition;
}
/** Options for the scale bar */
interface ScaleControlOptions {
    /** Show the scale bar. @default false */
    show?: boolean;
}
/** Options for the rotate/compass control */
interface RotateControlOptions {
    /** Show the rotate/compass control. @default false */
    show?: boolean;
    position?: ControlPosition;
}
/** Options for the locate-me button */
interface LocationControlOptions {
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
interface LatLng {
    lat: number;
    lng: number;
}
/** Root props for <GoogleMap /> */
interface GoogleMapProps {
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
    zoomControl?: boolean | ZoomControlOptions;
    fullscreenControl?: boolean | FullscreenControlOptions;
    mapTypeControl?: boolean | MapTypeControlOptions;
    streetViewControl?: boolean | StreetViewControlOptions;
    scaleControl?: boolean | ScaleControlOptions;
    rotateControl?: boolean | RotateControlOptions;
    locationControl?: boolean | LocationControlOptions;
    /** Fires once the map instance is ready. */
    onMapLoad?: (map: google.maps.Map) => void;
    /** Fires when the map centre changes. */
    onCenterChange?: (center: LatLng) => void;
    /** Fires when the zoom changes. */
    onZoomChange?: (zoom: number) => void;
    /** Fires when the map type changes. */
    onMapTypeChange?: (mapTypeId: MapTypeId) => void;
}

/**
 * <GoogleMap />
 *
 * Drop-in Google Maps component for React / Next.js.
 *
 * @example
 * <GoogleMap
 *   apiKey="YOUR_KEY"
 *   center={{ lat: 31.5204, lng: 74.3587 }}
 *   zoom={13}
 *   zoomControl
 *   fullscreenControl
 *   mapTypeControl={{ style: 'DROPDOWN_MENU' }}
 *   locationControl={{ showAccuracyCircle: true, zoomOnLocate: 16 }}
 * />
 */
declare const GoogleMap: React$1.FC<GoogleMapProps>;

declare function useGoogleMap(containerRef: React.RefObject<HTMLDivElement | null>, props: GoogleMapProps): {
    map: google.maps.Map | null;
};

export { type ControlPosition, type FullscreenControlOptions, GoogleMap, type GoogleMapProps, type LatLng, type LocationControlOptions, type MapTypeControlOptions, type MapTypeId, type RotateControlOptions, type ScaleControlOptions, type StreetViewControlOptions, type ZoomControlOptions, useGoogleMap };
