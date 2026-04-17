var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};

// src/components/GoogleMap.tsx
import { useRef as useRef2 } from "react";

// src/hooks/useGoogleMap.ts
import { useEffect, useRef, useCallback } from "react";

// src/utils/loadScript.ts
var CALLBACK = "__gmapsReactInit__";
var state = "idle";
var listeners = [];
function loadGoogleMapsScript(apiKey) {
  var _a;
  if (typeof window !== "undefined" && ((_a = window.google) == null ? void 0 : _a.maps)) {
    return Promise.resolve();
  }
  if (state === "ready") return Promise.resolve();
  if (state === "loading") {
    return new Promise((resolve) => listeners.push(resolve));
  }
  state = "loading";
  return new Promise((resolve, reject) => {
    listeners.push(resolve);
    window[CALLBACK] = () => {
      state = "ready";
      listeners.forEach((fn) => fn());
      listeners.length = 0;
    };
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${CALLBACK}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      state = "idle";
      reject(new Error("[GoogleMap] Failed to load Google Maps script. Check your API key."));
    };
    document.head.appendChild(script);
  });
}

// src/utils/helpers.ts
function resolvePosition(pos, fallback) {
  var _a;
  if (!pos) return fallback;
  return (_a = google.maps.ControlPosition[pos]) != null ? _a : fallback;
}
function resolveMapTypeIds(ids) {
  const map = {
    roadmap: google.maps.MapTypeId.ROADMAP,
    satellite: google.maps.MapTypeId.SATELLITE,
    hybrid: google.maps.MapTypeId.HYBRID,
    terrain: google.maps.MapTypeId.TERRAIN
  };
  return (ids != null ? ids : ["roadmap", "satellite", "hybrid", "terrain"]).map((id) => map[id]);
}
function resolveMapTypeControlStyle(style) {
  if (style === "HORIZONTAL_BAR") return google.maps.MapTypeControlStyle.HORIZONTAL_BAR;
  if (style === "DEFAULT") return google.maps.MapTypeControlStyle.DEFAULT;
  return google.maps.MapTypeControlStyle.DROPDOWN_MENU;
}
function normalise(value, defaults) {
  if (value === false) return __spreadValues({ show: false }, defaults);
  if (value === true || value === void 0) return __spreadValues({ show: true }, defaults);
  return __spreadValues(__spreadValues({ show: true }, defaults), value);
}

// src/hooks/useGoogleMap.ts
var LOCATE_ICON_IDLE = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
     stroke="#5f6368" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="8"/>
  <line x1="12" y1="2"  x2="12" y2="5"/>
  <line x1="12" y1="19" x2="12" y2="22"/>
  <line x1="2"  y1="12" x2="5"  y2="12"/>
  <line x1="19" y1="12" x2="22" y2="12"/>
  <circle cx="12" cy="12" r="2" fill="#5f6368"/>
</svg>`;
var LOCATE_ICON_ACTIVE = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
     stroke="#1a73e8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="8"/>
  <line x1="12" y1="2"  x2="12" y2="5"/>
  <line x1="12" y1="19" x2="12" y2="22"/>
  <line x1="2"  y1="12" x2="5"  y2="12"/>
  <line x1="19" y1="12" x2="22" y2="12"/>
  <circle cx="12" cy="12" r="2" fill="#1a73e8"/>
</svg>`;
var LOCATE_ICON_LOADING = `
<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
     stroke="#1a73e8" stroke-width="2.2" stroke-linecap="round"
     style="animation:__gm_spin__ 1s linear infinite">
  <path d="M12 2a10 10 0 0 1 10 10"/>
</svg>`;
function injectSpinKeyframe() {
  if (document.getElementById("__gm_spin_style__")) return;
  const s = document.createElement("style");
  s.id = "__gm_spin_style__";
  s.textContent = "@keyframes __gm_spin__ { to { transform: rotate(360deg); } }";
  document.head.appendChild(s);
}
function buildLocateButton() {
  const btn = document.createElement("button");
  btn.title = "My location";
  btn.setAttribute("aria-label", "My location");
  Object.assign(btn.style, {
    background: "#fff",
    border: "none",
    borderRadius: "2px",
    boxShadow: "0 1px 4px rgba(0,0,0,.3)",
    cursor: "pointer",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "10px",
    padding: "0"
  });
  btn.innerHTML = LOCATE_ICON_IDLE;
  btn.addEventListener("mouseover", () => {
    btn.style.background = "#ebebeb";
  });
  btn.addEventListener("mouseout", () => {
    btn.style.background = "#fff";
  });
  return btn;
}
function useGoogleMap(containerRef, props) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const watchIdRef = useRef(null);
  const locateBtnRef = useRef(null);
  const propsRef = useRef(props);
  useEffect(() => {
    propsRef.current = props;
  }, [props]);
  const locateUser = useCallback(() => {
    const btn = locateBtnRef.current;
    const map = mapRef.current;
    if (!btn || !map || !navigator.geolocation) return;
    const opts = normalise(
      propsRef.current.locationControl,
      {}
    );
    injectSpinKeyframe();
    btn.innerHTML = LOCATE_ICON_LOADING;
    const onSuccess = (pos) => {
      var _a, _b;
      const { latitude: lat, longitude: lng, accuracy } = pos.coords;
      const position = { lat, lng };
      map.panTo(position);
      map.setZoom((_a = opts.zoomOnLocate) != null ? _a : 16);
      if (opts.showAccuracyCircle !== false) {
        if (circleRef.current) circleRef.current.setMap(null);
        circleRef.current = new google.maps.Circle({
          map,
          center: position,
          radius: accuracy,
          fillColor: "#1a73e8",
          fillOpacity: 0.12,
          strokeColor: "#1a73e8",
          strokeOpacity: 0.4,
          strokeWeight: 1,
          clickable: false
        });
      }
      if (markerRef.current) {
        markerRef.current.setPosition(position);
      } else {
        markerRef.current = new google.maps.Marker({
          map,
          position,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#1a73e8",
            fillOpacity: 1,
            strokeColor: "#fff",
            strokeWeight: 3
          },
          title: "You are here",
          optimized: false
        });
      }
      btn.innerHTML = LOCATE_ICON_ACTIVE;
      (_b = opts.onLocate) == null ? void 0 : _b.call(opts, pos.coords);
      if (opts.watchPosition !== false) {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
        }
        watchIdRef.current = navigator.geolocation.watchPosition(
          (p) => {
            var _a2, _b2;
            const wPos = { lat: p.coords.latitude, lng: p.coords.longitude };
            (_a2 = markerRef.current) == null ? void 0 : _a2.setPosition(wPos);
            if (circleRef.current) {
              circleRef.current.setCenter(wPos);
              circleRef.current.setRadius(p.coords.accuracy);
            }
            (_b2 = opts.onLocate) == null ? void 0 : _b2.call(opts, p.coords);
          },
          () => {
          },
          { enableHighAccuracy: true, maximumAge: 3e3 }
        );
      }
    };
    const onError = (err) => {
      var _a;
      btn.innerHTML = LOCATE_ICON_IDLE;
      (_a = opts.onError) == null ? void 0 : _a.call(opts, err);
    };
    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 1e4,
      maximumAge: 5e3
    });
  }, []);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    loadGoogleMapsScript(props.apiKey).then(() => {
      if (cancelled || !containerRef.current) return;
      const {
        center = { lat: 0, lng: 0 },
        zoom = 12,
        mapTypeId = "roadmap",
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
        onMapTypeChange
      } = propsRef.current;
      const zoomOpts = normalise(zoomControl, {});
      const fullOpts = normalise(fullscreenControl, {});
      const typeOpts = normalise(mapTypeControl, { style: "DROPDOWN_MENU" });
      const streetOpts = normalise(streetViewControl, {});
      const scaleOpts = normalise(scaleControl, {});
      const rotateOpts = normalise(rotateControl, {});
      const locOpts = normalise(locationControl, {});
      const map = new google.maps.Map(containerRef.current, {
        center,
        zoom,
        mapTypeId,
        // Wire native controls directly from user options
        zoomControl: zoomOpts.show,
        zoomControlOptions: zoomOpts.show ? {
          position: resolvePosition(
            zoomOpts.position,
            google.maps.ControlPosition.RIGHT_BOTTOM
          )
        } : void 0,
        fullscreenControl: fullOpts.show,
        fullscreenControlOptions: fullOpts.show ? {
          position: resolvePosition(
            fullOpts.position,
            google.maps.ControlPosition.RIGHT_TOP
          )
        } : void 0,
        mapTypeControl: typeOpts.show,
        mapTypeControlOptions: typeOpts.show ? {
          style: resolveMapTypeControlStyle(typeOpts.style),
          position: resolvePosition(
            typeOpts.position,
            google.maps.ControlPosition.TOP_RIGHT
          ),
          mapTypeIds: resolveMapTypeIds(typeOpts.mapTypeIds)
        } : void 0,
        streetViewControl: streetOpts.show,
        streetViewControlOptions: streetOpts.show ? {
          position: resolvePosition(
            streetOpts.position,
            google.maps.ControlPosition.RIGHT_BOTTOM
          )
        } : void 0,
        scaleControl: scaleOpts.show,
        rotateControl: rotateOpts.show,
        rotateControlOptions: rotateOpts.show ? {
          position: resolvePosition(
            rotateOpts.position,
            google.maps.ControlPosition.RIGHT_BOTTOM
          )
        } : void 0
      });
      mapRef.current = map;
      if (locOpts.show !== false) {
        const btn = buildLocateButton();
        locateBtnRef.current = btn;
        btn.addEventListener("click", locateUser);
        map.controls[resolvePosition(
          locOpts.position,
          google.maps.ControlPosition.RIGHT_BOTTOM
        )].push(btn);
      }
      if (onCenterChange) {
        map.addListener("center_changed", () => {
          const c = map.getCenter();
          if (c) onCenterChange({ lat: c.lat(), lng: c.lng() });
        });
      }
      if (onZoomChange) {
        map.addListener("zoom_changed", () => {
          const z = map.getZoom();
          if (z !== void 0) onZoomChange(z);
        });
      }
      if (onMapTypeChange) {
        map.addListener("maptypeid_changed", () => {
          onMapTypeChange(map.getMapTypeId());
        });
      }
      onMapLoad == null ? void 0 : onMapLoad(map);
    });
    return () => {
      cancelled = true;
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [props.apiKey]);
  return { map: mapRef.current };
}

// src/components/GoogleMap.tsx
import { jsx } from "react/jsx-runtime";
var GoogleMap = (props) => {
  const _a = props, { className, style } = _a, rest = __objRest(_a, ["className", "style"]);
  const containerRef = useRef2(null);
  useGoogleMap(containerRef, rest);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      className,
      style: __spreadValues({
        width: "100%",
        height: "100%",
        minHeight: 300
      }, style)
    }
  );
};
GoogleMap.displayName = "GoogleMap";
export {
  GoogleMap,
  useGoogleMap
};
