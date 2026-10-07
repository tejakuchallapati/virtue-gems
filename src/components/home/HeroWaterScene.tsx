"use client";

import Image from "next/image";
import { motion, type MotionValue } from "framer-motion";

/** Water scene with the ring painted out; the ring + reflection come back as a separate tiltable layer. */
const BG_SRC = "/hero-water-bg.jpg";
const RING_LAYER_SRC = "/hero-water-ring-layer.webp";
/** Where the ring layer sits in the 16:9 photo — must match how the layer was cropped. */
const RING_LAYER_BOX = { left: "50.39%", top: "34.86%", width: "36.09%", height: "65.14%" };
/** Ring's vertical axis at the waterline — pivot for cursor rotation. */
const RING_PIVOT = "67.5% 67.5%";
const SWAY_S = 9;

/** All positions are % of the 16:9 photo. */
const RIPPLE_CENTER = { left: "68%", top: "67%" };
const RIPPLE_COUNT = 4;
const RIPPLE_S = 8;

const GLINTS = [
  { left: "63.5%", top: "47%", size: 2.2, delay: 0.4 },
  { left: "69.5%", top: "58%", size: 1.5, delay: 2.2 },
  { left: "58.7%", top: "54.4%", size: 1.4, delay: 3.3 },
  { left: "74.3%", top: "55.4%", size: 1.6, delay: 1.3 },
  { left: "70.9%", top: "45.2%", size: 1.1, delay: 4.4 },
  { left: "64.5%", top: "79%", size: 1.2, delay: 2.8 },
] as const;

const BOKEH = [
  { left: "84.1%", top: "30.8%", size: 6.5, delay: 0 },
  { left: "95.3%", top: "32.7%", size: 5.5, delay: 1.6 },
  { left: "92%", top: "39.8%", size: 4.5, delay: 3.1 },
  { left: "56.2%", top: "42.3%", size: 4, delay: 2.3 },
  { left: "50%", top: "38%", size: 4.5, delay: 0.9 },
  { left: "61.8%", top: "38.4%", size: 3.5, delay: 3.8 },
] as const;

/** Hides ripple arcs where they would cross the ring above the waterline. */
const RIPPLE_MASK =
  "radial-gradient(ellipse 18% 15% at 67% 54%, transparent 0%, transparent 80%, #000 100%)";

const centered = { x: "-50%", y: "-50%" } as const;

function Glint({ left, top, size, delay, live }: (typeof GLINTS)[number] & { live: boolean }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 24 24"
      className="absolute aspect-square"
      style={{ left, top, width: `${size}%`, ...centered, filter: "drop-shadow(0 0 6px rgba(255,248,225,0.95))" }}
      initial={{ opacity: 0, scale: 0.2 }}
      animate={live ? { opacity: [0, 1, 0], scale: [0.2, 1, 0.2], rotate: [0, 90] } : { opacity: 0, scale: 0.2 }}
      transition={
        live ? { duration: 1.6, delay, repeat: Infinity, repeatDelay: 4.2, ease: "easeInOut" } : { duration: 0.3 }
      }
    >
      <path
        d="M12 0C12.6 7.5 16.5 11.4 24 12C16.5 12.6 12.6 16.5 12 24C11.4 16.5 7.5 12.6 0 12C7.5 11.4 11.4 7.5 12 0Z"
        fill="#fffaf0"
      />
    </motion.svg>
  );
}

type HeroWaterSceneProps = {
  /** Ambient loops run only when true (intro done, on screen, motion allowed). */
  live: boolean;
  sizes: string;
  /** Cursor-driven ring rotation in degrees. */
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
};

/** The hero photo with a cursor-rotatable ring, water ripples, reflection shimmer, stone glow, glints and bokeh. */
export function HeroWaterScene({ live, sizes, rotateX, rotateY }: HeroWaterSceneProps) {
  return (
    <>
      <Image src={BG_SRC} alt="" fill priority quality={100} sizes={sizes} className="object-cover" />

      <div aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen">
        {BOKEH.map((b) => (
          <motion.span
            key={`${b.left}-${b.top}`}
            className="absolute aspect-square rounded-full"
            style={{
              left: b.left,
              top: b.top,
              width: `${b.size}%`,
              ...centered,
              background: "radial-gradient(circle, rgba(255,214,170,0.55) 0%, rgba(255,190,150,0.18) 45%, transparent 70%)",
            }}
            initial={{ opacity: 0 }}
            animate={live ? { opacity: [0, 0.85, 0], scale: [0.9, 1.08, 0.9] } : { opacity: 0 }}
            transition={live ? { duration: 5, delay: b.delay, repeat: Infinity, ease: "easeInOut" } : { duration: 0.6 }}
          />
        ))}
      </div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ rotateX, rotateY, transformOrigin: RING_PIVOT, transformPerspective: 1400 }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ transformOrigin: RING_PIVOT, transformPerspective: 1400 }}
          initial={false}
          animate={live ? { rotateY: [-2, 2, -2] } : { rotateY: 0 }}
          transition={live ? { duration: SWAY_S, repeat: Infinity, ease: "easeInOut" } : { duration: 1 }}
        >
          <div className="absolute" style={RING_LAYER_BOX}>
            <Image
              src={RING_LAYER_SRC}
              alt=""
              fill
              priority
              quality={100}
              sizes="(min-width: 1024px) 36vw, 72vw"
              className="object-fill"
            />
          </div>

          {/* Soft violet glow breathing inside the stone */}
          <motion.span
            className="absolute aspect-[10/11] w-[13%] rounded-[50%] mix-blend-screen"
            style={{
              left: "66.2%",
              top: "54%",
              ...centered,
              background:
                "radial-gradient(ellipse, rgba(190,130,255,0.5) 0%, rgba(160,100,255,0.15) 45%, transparent 70%)",
            }}
            initial={{ opacity: 0.25 }}
            animate={live ? { opacity: [0.2, 0.65, 0.2] } : { opacity: 0.25 }}
            transition={live ? { duration: 5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.6 }}
          />

          {GLINTS.map((g) => (
            <Glint key={`${g.left}-${g.top}`} {...g} live={live} />
          ))}
        </motion.div>
      </motion.div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{ maskImage: RIPPLE_MASK, WebkitMaskImage: RIPPLE_MASK }}
      >
        {Array.from({ length: RIPPLE_COUNT }, (_, i) => (
          <motion.span
            key={i}
            className="absolute aspect-[100/19] w-[92%] rounded-[50%]"
            style={{
              ...RIPPLE_CENTER,
              ...centered,
              border: "1.5px solid rgba(236,214,255,0.55)",
              boxShadow: "0 0 10px rgba(190,140,255,0.35), inset 0 0 8px rgba(255,230,190,0.2)",
            }}
            initial={{ opacity: 0, scale: 0.28 }}
            animate={live ? { opacity: [0, 0.75, 0], scale: [0.28, 1] } : { opacity: 0, scale: 0.28 }}
            transition={
              live
                ? {
                    duration: RIPPLE_S,
                    delay: (i * RIPPLE_S) / RIPPLE_COUNT,
                    repeat: Infinity,
                    ease: "easeOut",
                    opacity: { duration: RIPPLE_S, delay: (i * RIPPLE_S) / RIPPLE_COUNT, repeat: Infinity, times: [0, 0.2, 1] },
                  }
                : { duration: 0.6 }
            }
          />
        ))}
      </div>

      {/* Light drifting across the reflection */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[50%] top-[68%] h-[28%] w-[36%] overflow-hidden mix-blend-screen"
        style={{
          maskImage: "radial-gradient(ellipse 50% 50% at 50% 45%, #000 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 45%, #000 30%, transparent 100%)",
        }}
      >
        <motion.span
          className="absolute inset-y-0 left-0 w-1/2"
          style={{
            background:
              "linear-gradient(100deg, transparent 0%, rgba(220,190,255,0) 25%, rgba(230,205,255,0.3) 50%, rgba(220,190,255,0) 75%, transparent 100%)",
          }}
          initial={{ x: "-110%" }}
          animate={live ? { x: ["-110%", "220%"] } : { x: "-110%" }}
          transition={live ? { duration: 4.5, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" } : { duration: 0 }}
        />
      </div>
    </>
  );
}
