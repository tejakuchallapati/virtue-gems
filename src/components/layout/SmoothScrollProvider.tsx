"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useEffect } from "react";
import { setLenisInstance } from "@/lib/smooth-scroll";
import "lenis/dist/lenis.css";

function LenisBridge() {
  const lenis = useLenis();

  useEffect(() => {
    setLenisInstance(lenis ?? null);
    return () => setLenisInstance(null);
  }, [lenis]);

  return null;
}

type SmoothScrollProviderProps = {
  children: React.ReactNode;
};

/**
 * Document-level Lenis smooth scrolling.
 * The tree shape never changes, so pages are not remounted after hydration.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        lerp: 0.085,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.15,
        wheelMultiplier: 0.92,
        anchors: true,
        stopInertiaOnNavigate: true,
        respectReducedMotion: true,
        // Paused Lenis cancels wheel/touch unless the target can scroll itself (filter panels, drawers, carousels)
        allowNestedScroll: true,
      }}
    >
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
