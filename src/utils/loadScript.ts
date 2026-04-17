// ─────────────────────────────────────────────
//  Loads the Google Maps JS API script once,
//  even if multiple <GoogleMap> instances mount.
// ─────────────────────────────────────────────

const CALLBACK = '__gmapsReactInit__';

type Listener = () => void;

let state: 'idle' | 'loading' | 'ready' = 'idle';
const listeners: Listener[] = [];

export function loadGoogleMapsScript(apiKey: string): Promise<void> {
  // Already loaded
  if (typeof window !== 'undefined' && window.google?.maps) {
    return Promise.resolve();
  }

  if (state === 'ready') return Promise.resolve();

  if (state === 'loading') {
    return new Promise((resolve) => listeners.push(resolve));
  }

  state = 'loading';

  return new Promise((resolve, reject) => {
    listeners.push(resolve);

    // Expose global callback that the script tag will call
    (window as any)[CALLBACK] = () => {
      state = 'ready';
      listeners.forEach((fn) => fn());
      listeners.length = 0;
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${CALLBACK}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      state = 'idle';
      reject(new Error('[GoogleMap] Failed to load Google Maps script. Check your API key.'));
    };

    document.head.appendChild(script);
  });
}
