import React, { useEffect, useRef } from "react";

interface Marker { id: string; lat?: number; lng?: number; label?: string; emoji?: string }

interface MapViewProps {
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  markers?: Marker[];
  ariaLabel?: string;
}

export default function MapView({ className = "", center = { lat: 0, lng: 0 }, zoom = 14, markers = [], ariaLabel }: MapViewProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // If Google Maps JS SDK is present, initialize map. Otherwise keep fallback rendering area.
    if (typeof window !== "undefined" && (window as any).google && ref.current) {
      try {
        const gm = (window as any).google.maps;
        const map = new gm.Map(ref.current, {
          center: { lat: center.lat, lng: center.lng },
          zoom,
          disableDefaultUI: true,
        });

        markers.forEach((m) => {
          const marker = new gm.Marker({
            position: m.lat && m.lng ? { lat: m.lat, lng: m.lng } : map.getCenter(),
            map,
            title: m.label || m.id,
          });
          marker.set("aria-label", m.label || m.id);
        });
      } catch (e) {
        // fail silently — fallback UI will be shown
        // console.warn('Google Maps init failed', e);
      }
    }
  }, [center.lat, center.lng, markers, zoom]);

  return (
    <div
      role="region"
      aria-label={ariaLabel || "Map view"}
      className={`${className} relative overflow-hidden`}
    >
      <div ref={ref} className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-50 to-slate-100" />

      {/* Fallback: simple SVG grid + markers for demo when maps SDK unavailable */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <rect width="100" height="100" fill="transparent" />
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />

        {markers.map((m, i) => (
          <g key={m.id || i} transform={`translate(${10 + (i * 16) % 80}, ${20 + (i * 22) % 60})`}>
            <circle r={3} fill="#ef4444" stroke="#fff" strokeWidth={0.6} role="button" tabIndex={0} aria-label={m.label} />
            {m.emoji && (
              <text x={-4} y={6} fontSize={6}>
                {m.emoji}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
