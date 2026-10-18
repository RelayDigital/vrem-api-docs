

import React, { useMemo } from "react";

/**
 * THE PRODUCT'S OWN AURORA, PORTED VERBATIM.
 *
 * ── WHERE THIS COMES FROM ───────────────────────────────────────────────────
 *
 * Source of truth is the webapp:
 *   apps/frontend/components/shared/jobs/AuroraGradient.tsx (vrem-dev)
 * It is what a real project card, the job sheet header and the sidebar
 * notification card are all drawn on. This is a COPY, not an approximation —
 * the palette, the blob geometry, the seeded RNG, the blend modes and the grain
 * are all lifted from that file unchanged, so a tile on this page is the same
 * surface a customer sees in the app rather than a marketing-department guess
 * at it.
 *
 * The two repos cannot share code (this is RelayDigital/vrem-landing, that is
 * vrem-dev), so this is the one case where duplication is unavoidable. Treat
 * the webapp file as upstream: if the aurora changes there, change it here in
 * the same PR. Do not "improve" it here.
 *
 * ── WHAT WAS DELIBERATELY LEFT BEHIND ───────────────────────────────────────
 *
 * The upstream component can also derive the whole palette formulaically from
 * one hex, so an org that has recoloured its pipeline stages gets an aurora
 * matching its own colours (`customColor` / `useStatusColorOverride` /
 * `getSpectrumColors` / `hexToHSL`). That is meaningless here — a marketing
 * page has no org context and no colour store to read — so those paths are
 * dropped rather than carried as dead code. The curated per-status palette,
 * which is what an org that has NOT recoloured anything sees, is kept whole.
 *
 * `uiStatusToDisplayStatus` is likewise gone: upstream it maps a raw pipeline
 * status onto the nine display statuses, and here the caller just names one.
 *
 * ── WHY THE CLASSES ARE LITERAL ─────────────────────────────────────────────
 *
 * The palette is Tailwind classes rather than inline hex, upstream's choice, so
 * the light/dark base stays theme-safe. That only works if every class name
 * appears whole in the source for the scanner to find — never build one by
 * concatenation.
 */

export type DisplayStatus =
  | "PENDING_ASSIGNMENT"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "UPLOADED"
  | "EDITING"
  | "IN_REVIEW"
  | "DELIVERED"
  | "IN_REVISION"
  | "CANCELLED";

interface AuroraColorSet {
  base: string;
  primary: string;
  secondary: string;
  accent: string;
  highlight: string;
}

/** Higher tonal separation for marketing tiles; app replicas retain their native palette. */
const TILE_AURORA_COLORS: Record<DisplayStatus, AuroraColorSet> = {
  PENDING_ASSIGNMENT: {
    base: "bg-amber-100",
    primary: "bg-amber-500/80",
    secondary: "bg-orange-400/70",
    accent: "bg-yellow-50/90",
    highlight: "bg-rose-300/70",
  },
  SCHEDULED: {
    base: "bg-blue-100",
    primary: "bg-blue-500/80",
    secondary: "bg-indigo-400/70",
    accent: "bg-sky-50/90",
    highlight: "bg-violet-300/70",
  },
  IN_PROGRESS: {
    base: "bg-violet-100",
    primary: "bg-violet-500/80",
    secondary: "bg-purple-400/70",
    accent: "bg-fuchsia-50/90",
    highlight: "bg-blue-300/70",
  },
  UPLOADED: {
    base: "bg-teal-100",
    primary: "bg-teal-500/80",
    secondary: "bg-cyan-400/70",
    accent: "bg-emerald-50/90",
    highlight: "bg-sky-300/70",
  },
  EDITING: {
    base: "bg-red-100",
    primary: "bg-red-500/80",
    secondary: "bg-rose-400/70",
    accent: "bg-orange-50/90",
    highlight: "bg-red-300/70",
  },
  IN_REVIEW: {
    base: "bg-yellow-100",
    primary: "bg-yellow-500/80",
    secondary: "bg-amber-400/70",
    accent: "bg-orange-50/90",
    highlight: "bg-lime-300/70",
  },
  DELIVERED: {
    base: "bg-emerald-100",
    primary: "bg-emerald-500/80",
    secondary: "bg-emerald-400/70",
    accent: "bg-emerald-50/90",
    highlight: "bg-green-300/70",
  },
  IN_REVISION: {
    base: "bg-pink-100",
    primary: "bg-pink-500/80",
    secondary: "bg-rose-400/70",
    accent: "bg-fuchsia-50/90",
    highlight: "bg-pink-300/70",
  },
  CANCELLED: {
    base: "bg-slate-100",
    primary: "bg-slate-500/80",
    secondary: "bg-gray-400/70",
    accent: "bg-slate-50/90",
    highlight: "bg-zinc-300/70",
  },
};

/* Verbatim from the webapp. Hues mirror DISPLAY_STATUS_META there: orange /
 * blue / purple / teal / red / gold / green / rose, with slate-grey for the
 * terminal Cancelled state. */
const AURORA_COLORS: Record<DisplayStatus, AuroraColorSet> = {
  PENDING_ASSIGNMENT: {
    base: "bg-amber-100 dark:bg-amber-900/80",
    primary: "bg-amber-400/55",
    secondary: "bg-orange-300/45",
    accent: "bg-yellow-200/40",
    highlight: "bg-rose-300/30",
  },
  SCHEDULED: {
    base: "bg-blue-100 dark:bg-blue-900/80",
    primary: "bg-blue-400/55",
    secondary: "bg-indigo-300/45",
    accent: "bg-sky-200/40",
    highlight: "bg-violet-300/30",
  },
  IN_PROGRESS: {
    base: "bg-violet-100 dark:bg-violet-900/80",
    primary: "bg-violet-400/55",
    secondary: "bg-purple-300/45",
    accent: "bg-fuchsia-200/40",
    highlight: "bg-blue-300/30",
  },
  UPLOADED: {
    base: "bg-teal-100 dark:bg-teal-900/80",
    primary: "bg-teal-400/55",
    secondary: "bg-cyan-300/45",
    accent: "bg-emerald-200/40",
    highlight: "bg-sky-300/30",
  },
  EDITING: {
    base: "bg-red-100 dark:bg-red-900/80",
    primary: "bg-red-400/55",
    secondary: "bg-rose-300/45",
    accent: "bg-orange-200/40",
    highlight: "bg-red-300/30",
  },
  IN_REVIEW: {
    base: "bg-yellow-100 dark:bg-yellow-900/80",
    primary: "bg-yellow-500/55",
    secondary: "bg-amber-400/45",
    accent: "bg-orange-300/40",
    highlight: "bg-lime-300/30",
  },
  DELIVERED: {
    base: "bg-emerald-100 dark:bg-emerald-900/80",
    primary: "bg-emerald-400/55",
    secondary: "bg-teal-300/45",
    accent: "bg-cyan-200/40",
    highlight: "bg-green-300/30",
  },
  IN_REVISION: {
    base: "bg-pink-100 dark:bg-pink-900/80",
    primary: "bg-pink-400/55",
    secondary: "bg-rose-300/45",
    accent: "bg-fuchsia-200/40",
    highlight: "bg-red-300/30",
  },
  CANCELLED: {
    base: "bg-slate-100 dark:bg-slate-800/80",
    primary: "bg-slate-400/45",
    secondary: "bg-gray-300/40",
    accent: "bg-stone-300/35",
    highlight: "bg-slate-300/25",
  },
};

/* The seed is what makes two tiles with the same status look different rather
 * than cloned. Upstream feeds it the job id. */
const seededRandom = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 0x85ebca6b);
    hash = Math.imul(hash ^ (hash >>> 13), 0xc2b2ae35);
    hash = (hash ^ (hash >>> 16)) >>> 0;
    return (hash % 1000) / 1000;
  };
};

export function AuroraGradient({
  status,
  seed,
  className = "",
  /** Higher-detail mode for larger surfaces. Adds two blobs, grain and a vignette. */
  detail = false,
  highContrast = false,
}: {
  status: DisplayStatus;
  seed: string;
  className?: string;
  detail?: boolean;
  highContrast?: boolean;
}) {
  const palette = highContrast ? TILE_AURORA_COLORS : AURORA_COLORS;
  const colors = palette[status] ?? palette.CANCELLED;

  const blobs = useMemo(() => {
    const rand = seededRandom(seed);
    const pos = () => ({
      top: `${-25 + rand() * 70}%`,
      left: `${-25 + rand() * 70}%`,
    });
    const result = [
      {
        ...pos(),
        w: `${60 + rand() * 20}%`,
        h: `${55 + rand() * 20}%`,
        rot: rand() * 90 - 45,
        blur: "blur-3xl",
      },
      {
        ...pos(),
        w: `${55 + rand() * 18}%`,
        h: `${50 + rand() * 18}%`,
        rot: rand() * 90 - 45,
        blur: "blur-3xl",
      },
      {
        ...pos(),
        w: `${40 + rand() * 15}%`,
        h: `${35 + rand() * 15}%`,
        rot: rand() * 120 - 60,
        blur: "blur-2xl",
      },
      {
        ...pos(),
        w: `${25 + rand() * 15}%`,
        h: `${22 + rand() * 15}%`,
        rot: rand() * 120 - 60,
        blur: "blur-2xl",
      },
    ];
    if (detail) {
      result.push(
        {
          ...pos(),
          w: `${30 + rand() * 20}%`,
          h: `${28 + rand() * 18}%`,
          rot: rand() * 180 - 90,
          blur: "blur-xl",
        },
        {
          ...pos(),
          w: `${20 + rand() * 12}%`,
          h: `${18 + rand() * 12}%`,
          rot: rand() * 180 - 90,
          blur: "blur-xl",
        },
      );
    }
    return result;
  }, [seed, detail]);

  const colorClasses = [
    colors.primary,
    colors.secondary,
    colors.accent,
    colors.highlight,
    colors.accent,
    colors.secondary,
  ];

  return (
    <div
      className={`docs-aurora pointer-events-none select-none absolute inset-0 overflow-hidden ${colors.base} ${className}`}
      aria-hidden
    >
      {/* Blobs — mix-blend-mode for richer colour blending, as upstream. */}
      {blobs.map((blob, i) => (
        <div
          key={i}
          className={`pointer-events-none select-none absolute rounded-full ${blob.blur} ${
            !highContrast && i % 2 === 0
              ? "mix-blend-soft-light"
              : "mix-blend-normal"
          } ${colorClasses[i % colorClasses.length]}`}
          style={{
            top: blob.top,
            left: blob.left,
            width: blob.w,
            height: blob.h,
            transform: `rotate(${blob.rot}deg)`,
            borderRadius: `${40 + ((i * 7) % 20)}% ${60 - ((i * 5) % 15)}% ${
              45 + ((i * 3) % 18)
            }% ${55 - ((i * 9) % 12)}%`,
          }}
        />
      ))}

      {/* Film grain. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: detail ? "200px" : "128px",
        }}
      />

      {detail && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.08) 100%)",
          }}
        />
      )}
    </div>
  );
}
