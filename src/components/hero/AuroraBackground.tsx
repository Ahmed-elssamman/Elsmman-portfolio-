"use client";

/**
 * Aurora background — pure CSS animated gradient blobs.
 * Zero JS work per frame: the browser handles everything via transform/opacity keyframes.
 */
export function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-1/3 -left-1/4 w-[80vw] h-[80vw] rounded-full blur-3xl opacity-50 animate-aurora"
        style={{
          background:
            "radial-gradient(circle at center, rgba(122,182,255,0.55), rgba(122,182,255,0) 60%)",
          willChange: "transform, opacity",
        }}
      />
      <div
        className="absolute -bottom-1/3 -right-1/4 w-[75vw] h-[75vw] rounded-full blur-3xl opacity-50 animate-aurora"
        style={{
          background:
            "radial-gradient(circle at center, rgba(176,123,255,0.5), rgba(176,123,255,0) 60%)",
          animationDelay: "-7s",
          willChange: "transform, opacity",
        }}
      />
      <div
        className="absolute top-1/3 left-1/3 w-[50vw] h-[50vw] rounded-full blur-3xl opacity-40 animate-aurora"
        style={{
          background:
            "radial-gradient(circle at center, rgba(94,231,195,0.35), rgba(94,231,195,0) 60%)",
          animationDelay: "-4s",
          willChange: "transform, opacity",
        }}
      />
      {/* Grain / noise overlay to mask banding */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
