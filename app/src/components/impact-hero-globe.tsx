"use client";

import { useEffect, useRef, useState } from "react";

const waterStressPoints = [
  { lat: 9.0, lng: 38.7, name: "Ethiopia", severity: 0.9 },
  { lat: -1.3, lng: 36.8, name: "Kenya", severity: 0.85 },
  { lat: 12.0, lng: -1.5, name: "Burkina Faso", severity: 0.8 },
  { lat: 28.6, lng: 77.2, name: "New Delhi", severity: 0.95 },
  { lat: 24.9, lng: 67.0, name: "Karachi", severity: 0.88 },
  { lat: 33.3, lng: 44.4, name: "Baghdad", severity: 0.82 },
  { lat: 15.5, lng: -90.3, name: "Guatemala", severity: 0.75 },
  { lat: 13.7, lng: -89.2, name: "El Salvador", severity: 0.72 },
];

const partnershipArcs = [
  { startLat: 40.7, startLng: -74.0, endLat: -1.3, endLng: 36.8, label: "NYC-Nairobi" },
  { startLat: 40.7, startLng: -74.0, endLat: 19.1, endLng: 72.9, label: "NYC-Mumbai" },
  { startLat: 40.7, startLng: -74.0, endLat: 9.0, endLng: 38.7, label: "NYC-Addis" },
];

type GlobePoint = (typeof waterStressPoints)[number];
type GlobeArc = (typeof partnershipArcs)[number];

type GlobeInstance = {
  globeImageUrl: (value: string) => GlobeInstance;
  backgroundColor: (value: string) => GlobeInstance;
  showAtmosphere: (value: boolean) => GlobeInstance;
  atmosphereColor: (value: string) => GlobeInstance;
  atmosphereAltitude: (value: number) => GlobeInstance;
  width: (value: number) => GlobeInstance;
  height: (value: number) => GlobeInstance;
  pointsData: (value: GlobePoint[]) => GlobeInstance;
  pointAltitude: (value: number) => GlobeInstance;
  pointRadius: (value: (point: GlobePoint) => number) => GlobeInstance;
  pointColor: (value: () => string) => GlobeInstance;
  pointsMerge: (value: boolean) => GlobeInstance;
  arcsData: (value: GlobeArc[]) => GlobeInstance;
  arcColor: (value: () => string[]) => GlobeInstance;
  arcStroke: (value: number) => GlobeInstance;
  arcDashLength: (value: number) => GlobeInstance;
  arcDashGap: (value: number) => GlobeInstance;
  arcDashAnimateTime: (value: number) => GlobeInstance;
  arcAltitudeAutoScale: (value: number) => GlobeInstance;
  labelsData: (value: GlobePoint[]) => GlobeInstance;
  labelLat: (value: (point: GlobePoint) => number) => GlobeInstance;
  labelLng: (value: (point: GlobePoint) => number) => GlobeInstance;
  labelText: (value: (point: GlobePoint) => string) => GlobeInstance;
  labelSize: (value: number) => GlobeInstance;
  labelDotRadius: (value: number) => GlobeInstance;
  labelColor: (value: () => string) => GlobeInstance;
  labelResolution: (value: number) => GlobeInstance;
  labelAltitude: (value: number) => GlobeInstance;
  controls: () => {
    autoRotate: boolean;
    autoRotateSpeed: number;
    enableZoom: boolean;
    enablePan: boolean;
    minPolarAngle: number;
    maxPolarAngle: number;
  };
  pointOfView: (
    value: { lat: number; lng: number; altitude: number },
    transitionMs: number,
  ) => GlobeInstance;
  polygonsData: (value: unknown[]) => GlobeInstance;
  polygonCapColor: (value: () => string) => GlobeInstance;
  polygonSideColor: (value: () => string) => GlobeInstance;
  polygonStrokeColor: (value: () => string) => GlobeInstance;
  polygonAltitude: (value: number) => GlobeInstance;
  _destructor?: () => void;
};

type GlobeFactory = () => (element: HTMLElement) => GlobeInstance;

export function ImpactHeroGlobe() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    let cancelled = false;
    let animationFrameId = 0;
    let resizeTimer: number | undefined;
    let resizeHandler: (() => void) | undefined;
    let cleanupGlobe: (() => void) | undefined;

    async function mountGlobe() {
      if (!containerRef.current) return;

      try {
        const [{ default: Globe }, topojson] = await Promise.all([
          import("globe.gl"),
          import("topojson-client"),
        ]);

        if (cancelled || !containerRef.current) return;

        const container = containerRef.current;
        const createGlobe = Globe as unknown as GlobeFactory;
        const globe = createGlobe()(container)
          .globeImageUrl("https://unpkg.com/three-globe/example/img/earth-night.jpg")
          .backgroundColor("rgba(0,0,0,0)")
          .showAtmosphere(true)
          .atmosphereColor("#2563EB")
          .atmosphereAltitude(0.18)
          .width(container.clientWidth)
          .height(container.clientHeight)
          .pointsData(waterStressPoints)
          .pointAltitude(0.012)
          .pointRadius((point: GlobePoint) => 0.28 + point.severity * 0.38)
          .pointColor(() => "#60A5FA")
          .pointsMerge(false)
          .arcsData(partnershipArcs)
          .arcColor(() => ["#2563EB", "#93C5FD"])
          .arcStroke(0.55)
          .arcDashLength(0.42)
          .arcDashGap(0.24)
          .arcDashAnimateTime(3200)
          .arcAltitudeAutoScale(0.38)
          .labelsData(waterStressPoints)
          .labelLat((point: GlobePoint) => point.lat)
          .labelLng((point: GlobePoint) => point.lng)
          .labelText((point: GlobePoint) => point.name)
          .labelSize(0.62)
          .labelDotRadius(0.16)
          .labelColor(() => "rgba(147, 197, 253, 0.72)")
          .labelResolution(2)
          .labelAltitude(0.018);

        const controls = globe.controls();
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.45;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.minPolarAngle = Math.PI * 0.3;
        controls.maxPolarAngle = Math.PI * 0.72;

        globe.pointOfView({ lat: 15, lng: 30, altitude: 2.15 }, 0);

        let pulsePhase = 0;
        const animatePulse = () => {
          pulsePhase += 0.03;
          const pulseFactor = 1 + 0.22 * Math.sin(pulsePhase);

          globe.pointRadius((point: GlobePoint) => {
            return (0.28 + point.severity * 0.38) * pulseFactor;
          });

          animationFrameId = window.requestAnimationFrame(animatePulse);
        };
        animatePulse();

        const handleResize = () => {
          if (!containerRef.current) return;
          globe.width(containerRef.current.clientWidth);
          globe.height(containerRef.current.clientHeight);
        };

        resizeHandler = () => {
          window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(handleResize, 140);
        };
        window.addEventListener("resize", resizeHandler);

        try {
          const worldData = await fetch("https://unpkg.com/world-atlas@2/countries-110m.json").then(
            (response) => response.json(),
          );

          if (!cancelled) {
            const countries = (
              topojson.feature(worldData, worldData.objects.countries) as unknown as {
                features: unknown[];
              }
            ).features;

            globe
              .polygonsData(countries)
              .polygonCapColor(() => "#0F2440")
              .polygonSideColor(() => "#09162B")
              .polygonStrokeColor(() => "#1A3A5A")
              .polygonAltitude(0.006);
          }
        } catch (error) {
          // The globe stays useful without the optional country polygon overlay.
          void error;
        }

        cleanupGlobe = () => {
          window.cancelAnimationFrame(animationFrameId);
          if (resizeTimer) window.clearTimeout(resizeTimer);
          if (resizeHandler) window.removeEventListener("resize", resizeHandler);
          if (typeof globe._destructor === "function") {
            globe._destructor();
          }
          container.replaceChildren();
        };

        setStatus("ready");
      } catch (error) {
        console.error("Impact globe hero failed to initialize.", error);
        if (!cancelled) {
          setStatus("fallback");
        }
      }
    }

    mountGlobe();

    return () => {
      cancelled = true;
      if (cleanupGlobe) cleanupGlobe();
    };
  }, []);

  return (
    <div className="impact-globe-stage">
      <div className="impact-globe-status">
        {status === "ready" ? "Live geospatial proof surface" : "Loading observatory globe"}
      </div>
      <div className="impact-globe-meta">
        <span>8 focus regions</span>
        <span aria-hidden="true">•</span>
        <span>3 partner corridors</span>
      </div>
      <div ref={containerRef} className="impact-globe-canvas" aria-hidden="true" />
      <div className="impact-globe-scrim" />
      <div className="impact-globe-caption">
        <div className="impact-globe-caption-row">
          <span className="impact-chip impact-chip-neutral">Impact Proof</span>
          <span className="impact-globe-caption-copy">Africa, South Asia, MENA, and Central America</span>
        </div>
        <p className="impact-globe-note">
          The globe is the brand moment for Impact because the work only matters if it stays
          tied to actual places, stress corridors, and public evidence.
        </p>
      </div>
      {status === "fallback" ? (
        <div className="impact-globe-fallback" aria-hidden="true">
          <div className="impact-globe-fallback-ring" />
          <div className="impact-globe-fallback-ring impact-globe-fallback-ring-2" />
          <div className="impact-globe-fallback-core" />
        </div>
      ) : null}
    </div>
  );
}
