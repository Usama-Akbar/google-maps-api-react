import { useEffect, useRef, useCallback } from 'react';
import { loadGoogleMapsScript } from '../utils/loadScript';
import { resolvePosition, resolveMapTypeIds, resolveMapTypeControlStyle, normalise } from '../utils/helpers';
import type { GoogleMapProps, LatLng, LocationControlOptions } from '../types';

const LOCATE_ICON_IDLE = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
     stroke="#5f6368" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="8"/>
  <line x1="12" y1="2"  x2="12" y2="5"/>
  <line x1="12" y1="19" x2="12" y2="22"/>
  <line x1="2"  y1="12" x2="5"  y2="12"/>
  <line x1="19" y1="12" x2="22" y2="12"/>
  <circle cx="12" cy="12" r="2" fill="#5f6368"/>
</svg>`;

const LOCATE_ICON_ACTIVE = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
     stroke="#1a73e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="8"/>
  <line x1="12" y1="2"  x2="12" y2="5"/>
  <line x1="12" y1="19" x2="12" y2="22"/>
  <line x1="2"  y1="12" x2="5"  y2="12"/>
  <line x1="19" y1="12" x2="22" y2="12"/>
  <circle cx="12" cy="12" r="2" fill="#1a73e8"/>
</svg>`;

const LOCATE_ICON_LOADING = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
     stroke="#1a73e8" stroke-width="2.2" stroke-linecap="round"
     style="animation:__gm_spin__ 1s linear infinite">
  <path d="M12 2a10 10 0 0 1 10 10"/>
</svg>`;

function injectSpinKeyframe() {
  if (document.getElementById('__gm_spin_style__')) return;
  const s = document.createElement('style');
  s.id = '__gm_spin_style__';
  s.textContent = '@keyframes __gm_spin__ { to { transform: rotate(360deg); } }';
  document.head.appendChild(s);
}

function buildLocateButton(): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.title = 'My location';
  btn.setAttribute('aria-label', 'My location');
  Object.assign(btn.style, {
    background: '#fff',
    border: 'none',
    borderRadius: '2px',
    boxShadow: '0 1px 4px rgba(0,0,0,.3)',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10px',
    padding: '0',
  });
  btn.innerHTML = LOCATE_ICON_IDLE;
  btn.addEventListener('mouseover', () => { btn.style.background = '#ebebeb'; });
  btn.addEventListener('mouseout',  () => { btn.style.background = '#fff'; });
  return btn;
}

export function useGoogleMap(
  containerRef: React.RefObject<HTMLDivElement | null>,
  props: GoogleMapProps
) {
  const mapRef            = useRef<google.maps.Map | null>(null);
  const markerRef         = useRef<google.maps.Marker | null>(null);
  const circleRef         = useRef<google.maps.Circle | null>(null);
  const watchIdRef        = useRef<number | null>(null);
  const locateBtnRef      = useRef<HTMLButtonElement | null>(null);

  // Keep latest callbacks in a ref so the map listeners don't go stale
  const propsRef = useRef(props);
  useEffect(() => { propsRef.current = props; }, [props]);

  const locateUser = useCallback(() => {
    const btn = locateBtnRef.current;
    const map = mapRef.current;
    if (!btn || !map || !navigator.geolocation) return;

    const opts = normalise<LocationControlOptions>(
      propsRef.current.locationControl,
      {}
    );

    injectSpinKeyframe();
    btn.innerHTML = LOCATE_ICON_LOADING;

    const onSuccess = (pos: GeolocationPosition) => {
      const { latitude: lat, longitude: lng, accuracy } = pos.coords;
      const position: LatLng = { lat, lng };

      map.panTo(position);
      map.setZoom(opts.zoomOnLocate ?? 16);

      // Accuracy circle
      if (opts.showAccuracyCircle !== false) {
        if (circleRef.current) circleRef.current.setMap(null);
        circleRef.current = new google.maps.Circle({
          map,
          center: position,
          radius: accuracy,
          fillColor: '#1a73e8',
          fillOpacity: 0.12,
          strokeColor: '#1a73e8',
          strokeOpacity: 0.4,
          strokeWeight: 1,
          clickable: false,
        });
      }

      // Blue dot marker
      if (markerRef.current) {
        markerRef.current.setPosition(position);
      } else {
        markerRef.current = new google.maps.Marker({
          map,
          position,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#1a73e8',
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 3,
          },
          title: 'You are here',
          optimized: false,
        });
      }

      btn.innerHTML = LOCATE_ICON_ACTIVE;
      opts.onLocate?.(pos.coords);

      // Continuous watch
      if (opts.watchPosition !== false) {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
        }
        watchIdRef.current = navigator.geolocation.watchPosition(
          (p) => {
            const wPos: LatLng = { lat: p.coords.latitude, lng: p.coords.longitude };
            markerRef.current?.setPosition(wPos);
            if (circleRef.current) {
              circleRef.current.setCenter(wPos);
              circleRef.current.setRadius(p.coords.accuracy);
            }
            opts.onLocate?.(p.coords);
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 3000 }
        );
      }
    };

    const onError = (err: GeolocationPositionError) => {
      btn.innerHTML = LOCATE_ICON_IDLE;
      opts.onError?.(err);
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    loadGoogleMapsScript(props.apiKey).then(() => {
      if (cancelled || !containerRef.current) return;

      const {
        center        = { lat: 0, lng: 0 },
        zoom          = 12,
        mapTypeId     = 'roadmap',
        zoomControl,
        fullscreenControl,
        mapTypeControl,
        streetViewControl,
        scaleControl,
        rotateControl,
        locationControl,
        onMapLoad,
        onCenterChange,
        onZoomChange,
        onMapTypeChange,
      } = propsRef.current;

      const zoomOpts        = normalise(zoomControl,        {});
      const fullOpts        = normalise(fullscreenControl,  {});
      const typeOpts        = normalise(mapTypeControl,     { style: 'DROPDOWN_MENU' as const });
      const streetOpts      = normalise(streetViewControl,  {});
      const scaleOpts       = normalise(scaleControl,       {});
      const rotateOpts      = normalise(rotateControl,      {});
      const locOpts         = normalise(locationControl,    {});

      const map = new google.maps.Map(containerRef.current!, {
        center,
        zoom,
        mapTypeId,

        // Wire native controls directly from user options
        zoomControl:       zoomOpts.show,
        zoomControlOptions: zoomOpts.show ? {
          position: resolvePosition(
            (zoomOpts as any).position,
            google.maps.ControlPosition.RIGHT_BOTTOM
          ),
        } : undefined,

        fullscreenControl:       fullOpts.show,
        fullscreenControlOptions: fullOpts.show ? {
          position: resolvePosition(
            (fullOpts as any).position,
            google.maps.ControlPosition.RIGHT_TOP
          ),
        } : undefined,

        mapTypeControl:       typeOpts.show,
        mapTypeControlOptions: typeOpts.show ? {
          style: resolveMapTypeControlStyle((typeOpts as any).style),
          position: resolvePosition(
            (typeOpts as any).position,
            google.maps.ControlPosition.TOP_RIGHT
          ),
          mapTypeIds: resolveMapTypeIds((typeOpts as any).mapTypeIds),
        } : undefined,

        streetViewControl:       streetOpts.show,
        streetViewControlOptions: streetOpts.show ? {
          position: resolvePosition(
            (streetOpts as any).position,
            google.maps.ControlPosition.RIGHT_BOTTOM
          ),
        } : undefined,

        scaleControl: scaleOpts.show,
        rotateControl: rotateOpts.show,
        rotateControlOptions: rotateOpts.show ? {
          position: resolvePosition(
            (rotateOpts as any).position,
            google.maps.ControlPosition.RIGHT_BOTTOM
          ),
        } : undefined,
      });

      mapRef.current = map;

      // ── Locate-me custom button ──
      if (locOpts.show !== false) {
        const btn = buildLocateButton();
        locateBtnRef.current = btn;
        btn.addEventListener('click', locateUser);
        map.controls[
          resolvePosition(
            (locOpts as any).position,
            google.maps.ControlPosition.RIGHT_BOTTOM
          )
        ].push(btn);
      }

      // ── Map event listeners ──
      if (onCenterChange) {
        map.addListener('center_changed', () => {
          const c = map.getCenter();
          if (c) onCenterChange({ lat: c.lat(), lng: c.lng() });
        });
      }

      if (onZoomChange) {
        map.addListener('zoom_changed', () => {
          const z = map.getZoom();
          if (z !== undefined) onZoomChange(z);
        });
      }

      if (onMapTypeChange) {
        map.addListener('maptypeid_changed', () => {
          onMapTypeChange(map.getMapTypeId() as any);
        });
      }

      onMapLoad?.(map);
    });

    return () => {
      cancelled = true;
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.apiKey]); // re-init only if apiKey changes

  return { map: mapRef.current };
}
