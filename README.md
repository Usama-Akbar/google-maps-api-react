# @usamadev/google-maps-react

A plug-and-play Google Maps component for **React** and **Next.js**.  
Enable zoom, fullscreen, map-type switcher, street-view, scale, rotate and locate-me controls with a single prop each — all powered by Google's own native controls.

---

## Installation

```bash
npm install @usamadev/google-maps-react
# or
yarn add @usamadev/google-maps-react
```

> **Peer deps:** React ≥ 17

---

## Quick start

```tsx
import { GoogleMap } from '@usamadev/google-maps-react'

export default function Page() {
  return (
    <div style={{ height: '100vh' }}>
      <GoogleMap
        apiKey="YOUR_GOOGLE_MAPS_API_KEY"
        center={{ lat: 31.5204, lng: 74.3587 }}
        zoom={13}
        zoomControl
        fullscreenControl
        mapTypeControl
        locationControl
      />
    </div>
  )
}
```

That's it — no extra providers, no script tags, nothing else.

---

## Next.js usage

Works in both the **App Router** and **Pages Router**.  
Because the map touches the DOM, mark the parent as a Client Component:

```tsx
// app/map/page.tsx
'use client'
import { GoogleMap } from '@usamadev/google-maps-react'

export default function MapPage() {
  return (
    <div style={{ height: '100svh' }}>
      <GoogleMap
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}
        center={{ lat: 51.505, lng: -0.09 }}
        zoom={12}
        zoomControl
        fullscreenControl
        mapTypeControl={{ style: 'DROPDOWN_MENU' }}
        locationControl={{ showAccuracyCircle: true }}
      />
    </div>
  )
}
```

---

## Props

### Core

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `apiKey` | `string` | **required** | Google Maps JavaScript API key |
| `center` | `{ lat, lng }` | `{ lat: 0, lng: 0 }` | Initial map centre |
| `zoom` | `number` | `12` | Initial zoom level |
| `mapTypeId` | `'roadmap' \| 'satellite' \| 'hybrid' \| 'terrain'` | `'roadmap'` | Default map type |
| `className` | `string` | — | Class on the wrapper div |
| `style` | `CSSProperties` | — | Inline style on the wrapper div |

---

### Controls

Every control accepts **`true` / `false`** (show/hide with defaults) **or an options object** for full control.

#### `zoomControl`
```tsx
// Simple
zoomControl            // same as zoomControl={true}
zoomControl={false}    // hide

// With options
zoomControl={{ position: 'RIGHT_BOTTOM' }}
```
| Option | Type | Default |
|--------|------|---------|
| `show` | `boolean` | `true` |
| `position` | `ControlPosition` | `'RIGHT_BOTTOM'` |

---

#### `fullscreenControl`
```tsx
fullscreenControl
fullscreenControl={{ position: 'RIGHT_TOP' }}
```
| Option | Type | Default |
|--------|------|---------|
| `show` | `boolean` | `true` |
| `position` | `ControlPosition` | `'RIGHT_TOP'` |

---

#### `mapTypeControl`  *(Map / Satellite / Hybrid / Terrain switcher)*
```tsx
mapTypeControl
mapTypeControl={{
  style: 'DROPDOWN_MENU',         // 'DEFAULT' | 'DROPDOWN_MENU' | 'HORIZONTAL_BAR'
  position: 'TOP_RIGHT',
  mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain'],
}}
```
| Option | Type | Default |
|--------|------|---------|
| `show` | `boolean` | `true` |
| `style` | `'DEFAULT' \| 'DROPDOWN_MENU' \| 'HORIZONTAL_BAR'` | `'DROPDOWN_MENU'` |
| `position` | `ControlPosition` | `'TOP_RIGHT'` |
| `mapTypeIds` | `MapTypeId[]` | all four types |

---

#### `streetViewControl`  *(Pegman)*
```tsx
streetViewControl
streetViewControl={{ position: 'RIGHT_BOTTOM' }}
```
| Option | Type | Default |
|--------|------|---------|
| `show` | `boolean` | `false` |
| `position` | `ControlPosition` | `'RIGHT_BOTTOM'` |

---

#### `scaleControl`  *(Scale bar)*
```tsx
scaleControl
```
| Option | Type | Default |
|--------|------|---------|
| `show` | `boolean` | `false` |

---

#### `rotateControl`  *(Compass / rotate)*
```tsx
rotateControl
rotateControl={{ position: 'RIGHT_BOTTOM' }}
```
| Option | Type | Default |
|--------|------|---------|
| `show` | `boolean` | `false` |
| `position` | `ControlPosition` | `'RIGHT_BOTTOM'` |

---

#### `locationControl`  *(Locate-me blue dot)*
```tsx
locationControl
locationControl={{
  position: 'RIGHT_BOTTOM',
  zoomOnLocate: 16,
  showAccuracyCircle: true,
  watchPosition: true,
  onLocate: (coords) => console.log(coords.latitude, coords.longitude),
  onError: (err) => console.error(err.message),
}}
```
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `show` | `boolean` | `true` | Show the button |
| `position` | `ControlPosition` | `'RIGHT_BOTTOM'` | Where to place the button |
| `zoomOnLocate` | `number` | `16` | Zoom level after first fix |
| `showAccuracyCircle` | `boolean` | `true` | Blue accuracy ring |
| `watchPosition` | `boolean` | `true` | Keep tracking after first fix |
| `onLocate` | `(coords: GeolocationCoordinates) => void` | — | Called on every position update |
| `onError` | `(error: GeolocationPositionError) => void` | — | Called on geolocation failure |

---

### Event callbacks

| Prop | Type | Description |
|------|------|-------------|
| `onMapLoad` | `(map: google.maps.Map) => void` | Fires once the map is ready |
| `onCenterChange` | `(center: LatLng) => void` | Fires when centre changes |
| `onZoomChange` | `(zoom: number) => void` | Fires when zoom changes |
| `onMapTypeChange` | `(mapTypeId: MapTypeId) => void` | Fires when map type changes |

---

### `ControlPosition` values

```
TOP_LEFT    TOP_CENTER    TOP_RIGHT
LEFT_TOP    LEFT_CENTER   LEFT_BOTTOM
RIGHT_TOP   RIGHT_CENTER  RIGHT_BOTTOM
BOTTOM_LEFT BOTTOM_CENTER BOTTOM_RIGHT
```

---

## Advanced — access the map instance

```tsx
import { GoogleMap } from '@usamadev/google-maps-react'

export default function AdvancedMap() {
  function handleMapLoad(map: google.maps.Map) {
    // Full google.maps.Map instance — add markers, overlays, anything
    new google.maps.Marker({
      map,
      position: { lat: 31.5204, lng: 74.3587 },
      title: 'Lahore',
    })
  }

  return (
    <div style={{ height: '100vh' }}>
      <GoogleMap
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}
        center={{ lat: 31.5204, lng: 74.3587 }}
        zoom={13}
        zoomControl
        fullscreenControl
        mapTypeControl
        locationControl
        onMapLoad={handleMapLoad}
        onZoomChange={(z) => console.log('zoom:', z)}
      />
    </div>
  )
}
```

---

## `useGoogleMap` hook

For headless / custom container use cases:

```tsx
import { useRef } from 'react'
import { useGoogleMap } from '@usamadev/google-maps-react'

export function CustomMap() {
  const ref = useRef<HTMLDivElement>(null)
  useGoogleMap(ref, {
    apiKey: 'YOUR_KEY',
    center: { lat: 31.5204, lng: 74.3587 },
    zoom: 13,
    locationControl: true,
    zoomControl: true,
  })
  return <div ref={ref} style={{ width: '100%', height: 500 }} />
}
```

---

## Environment variable (recommended)

```env
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_api_key_here
```

```tsx
<GoogleMap apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!} ... />
```

---

## License

MIT © [usamadev](https://github.com/Usama-Akbar)
