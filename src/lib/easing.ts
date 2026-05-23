// Cinematic easing curves used across motion and GSAP animations.
export const easing = {
  // Apple/Linear-style standard
  standard: [0.32, 0.72, 0, 1] as [number, number, number, number],
  // Slow start, sharp end
  enter: [0.16, 1, 0.3, 1] as [number, number, number, number],
  // Sharp start, slow settle
  exit: [0.7, 0, 0.84, 0] as [number, number, number, number],
  // Cinematic camera glide
  glide: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export const gsapEase = {
  standard: "cubic-bezier(0.32, 0.72, 0, 1)",
  enter: "expo.out",
  exit: "expo.in",
  glide: "power3.out",
};
