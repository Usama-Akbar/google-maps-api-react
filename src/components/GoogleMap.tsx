import React, { useRef } from 'react';
import { useGoogleMap } from '../hooks/useGoogleMap';
import type { GoogleMapProps } from '../types';

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
export const GoogleMap: React.FC<GoogleMapProps> = (props) => {
  const { className, style, ...rest } = props;
  const containerRef = useRef<HTMLDivElement>(null);

  useGoogleMap(containerRef, rest);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 300,
        ...style,
      }}
    />
  );
};

GoogleMap.displayName = 'GoogleMap';
