import { useEffect, useMemo, useState } from "react";

type LeafletBundle = typeof import("leaflet");

type Zone = {
  name: string;
  coords: [number, number];
};

const ZONES: Zone[] = [
  { name: "Sydney HQ", coords: [-33.8688, 151.2093] },
  { name: "Northside", coords: [-33.823, 151.192] },
  { name: "Surry", coords: [-33.8861, 151.2111] },
  { name: "Bondi", coords: [-33.8915, 151.2767] }
];

function markerSvg() {
  const navy = "#0A1922";
  const aqua = "#A5E6DF";
  return `
  <svg width="46" height="46" viewBox="0 0 46 46" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="2.6" result="blur" />
        <feColorMatrix in="blur" type="matrix"
          values="0 0 0 0 0.647
                  0 0 0 0 0.902
                  0 0 0 0 0.875
                  0 0 0 0.55 0" result="glow"/>
        <feMerge>
          <feMergeNode in="glow"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="23" cy="23" r="14" fill="${aqua}" opacity="0.35" filter="url(#softGlow)"/>
    <path d="M23 42c6.2-8.2 10-13.4 10-20.1C33 14.7 28.3 10 23 10s-10 4.7-10 11.9C13 28.6 16.8 33.8 23 42z"
      fill="${navy}"/>
    <circle cx="23" cy="21.5" r="4.5" fill="${aqua}"/>
  </svg>`;
}

export function ServiceMap({ className = "" }: { className?: string }) {
  const [leaflet, setLeaflet] = useState<LeafletBundle | null>(null);

  // Prevent any SSR/"window is not defined" style issues by loading Leaflet only on client.
  useEffect(() => {
    let active = true;
    void (async () => {
      const L = await import("leaflet");
      if (!active) return;
      setLeaflet(L);
    })();
    return () => {
      active = false;
    };
  }, []);

  const icon = useMemo(() => {
    if (!leaflet) return null;
    return leaflet.divIcon({
      className: "fsc-zone-marker",
      html: markerSvg(),
      iconSize: [46, 46],
      iconAnchor: [23, 42],
      popupAnchor: [0, -36]
    });
  }, [leaflet]);

  // Lazy-load react-leaflet only after mount (keeps bundle safe and clean).
  const [rl, setRl] = useState<null | {
    MapContainer: typeof import("react-leaflet").MapContainer;
    TileLayer: typeof import("react-leaflet").TileLayer;
    Marker: typeof import("react-leaflet").Marker;
    Tooltip: typeof import("react-leaflet").Tooltip;
  }>(null);

  useEffect(() => {
    let active = true;
    void (async () => {
      const mod = await import("react-leaflet");
      if (!active) return;
      setRl({
        MapContainer: mod.MapContainer,
        TileLayer: mod.TileLayer,
        Marker: mod.Marker,
        Tooltip: mod.Tooltip
      });
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!rl || !icon) {
    return (
      <div
        className={[
          "relative overflow-hidden rounded-xl2 border border-clinical-aqua/30 bg-white shadow-clinicalSm",
          "min-h-[340px] w-full",
          className
        ].join(" ")}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white via-clinical-lavender to-white" />
        <div className="relative flex h-full items-center justify-center p-8 text-sm text-clinical-charcoal/60">
          Loading service zones…
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Tooltip } = rl;

  return (
    <div
      className={[
        "relative overflow-hidden rounded-xl2 border border-clinical-aqua/30 bg-white shadow-[0_18px_55px_rgba(10,25,34,0.12)]",
        className
      ].join(" ")}
    >
      <div className="absolute right-4 top-4 z-[500] rounded-2xl border border-black/5 bg-white/90 px-4 py-3 shadow-clinicalSm backdrop-blur">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-clinical-charcoal/70">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/40" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          LIVE: SYDNEY WIDE COVERAGE
        </div>
      </div>

      <MapContainer
        center={[-33.8688, 151.2093]}
        zoom={12}
        scrollWheelZoom={false}
        className="h-[340px] w-full md:h-[420px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {ZONES.map((z) => (
          <Marker key={z.name} position={z.coords} icon={icon}>
            <Tooltip
              direction="top"
              offset={[0, -26]}
              opacity={1}
              className="fsc-zone-tooltip"
              sticky
            >
              <div className="rounded-xl border border-black/10 bg-white px-3 py-2 shadow-clinicalSm">
                <div className="text-xs font-semibold text-[#0A1922]">
                  Service Zone: {z.name}
                </div>
                <div className="mt-0.5 text-[11px] text-[#0A1922]/70">
                  Clinical Teams Active.
                </div>
              </div>
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

