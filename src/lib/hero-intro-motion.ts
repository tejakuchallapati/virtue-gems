export const HERO_INTRO_EASE = [0.22, 1, 0.36, 1] as const;

/** Floating gems / sparkles that fly in one-by-one in 3D space */
export const HERO_DEPTH_ORBS = [
  { left: "12%", top: "22%", size: 10, delay: 0.35, z: 80, rot: 18 },
  { left: "86%", top: "20%", size: 8, delay: 0.5, z: 120, rot: -22 },
  { left: "8%", top: "58%", size: 7, delay: 0.65, z: 60, rot: 12 },
  { left: "90%", top: "55%", size: 11, delay: 0.8, z: 100, rot: -15 },
  { left: "20%", top: "78%", size: 6, delay: 0.95, z: 140, rot: 25 },
  { left: "78%", top: "76%", size: 9, delay: 1.1, z: 90, rot: -18 },
  { left: "48%", top: "14%", size: 5, delay: 1.2, z: 160, rot: 8 },
] as const;

export const HERO_DEPTH_RINGS = [
  { size: "38vmin", delay: 0.25, z: 40 },
  { size: "58vmin", delay: 0.45, z: 20 },
  { size: "78vmin", delay: 0.65, z: 5 },
] as const;
