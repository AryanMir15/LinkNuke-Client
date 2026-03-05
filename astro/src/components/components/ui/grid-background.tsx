'use client';

import * as React from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';
import cn from '../../lib/utils';

type GridSize = '4:4' | '5:5' | '6:6' | '6:8' | '8:8' | '8:12' | '10:10' | '12:12' | '12:16' | '16:16';

type GridBackgroundProps = HTMLMotionProps<'div'> & {
  children?: React.ReactNode;
  gridSize?: GridSize;
  colors?: {
    background?: string;
    borderColor?: string;
    borderSize?: string;
    borderStyle?: 'solid' | 'dashed' | 'dotted';
  };
  beams?: {
    count?: number;
    colors?: string[];
    size?: string;
    shadow?: string;
    speed?: number;
  };
  accentLines?: {
    lines?: Array<{
      orientation: 'horizontal' | 'vertical';
      /** percentage (0-100) from top for horizontal, from left for vertical */
      positionPercent: number;
      /** optional CSS length for line thickness */
      thickness?: string;
      /** tailwind color class applied to the line background */
      colorClass?: string;
      /** 0-1 opacity for subtlety */
      opacity?: number;
      /** optional inset from container edges to shorten the line (CSS length) */
      insetStart?: string;
      insetEnd?: string;
    }>;
    particlesPerLine?: number; // recommended 2-6 based on perf
    particleClass?: string; // tailwind class
    particleSizePx?: number; // pixel size of particle
    particleSpeedSec?: number; // duration to traverse once
  };
};

function GridBackground({
  className,
  children,
  gridSize = '8:8',
  colors = {},
  beams = {},
  accentLines,
  ...props
}: GridBackgroundProps) {
  const {
    background = 'bg-slate-900',
    borderColor = 'border-slate-700/50',
    borderSize = '1px',
    borderStyle = 'solid',
  } = colors;

  const {
    count = 12,
    colors: beamColors = [
      'bg-cyan-400',
      'bg-purple-400',
      'bg-fuchsia-400',
      'bg-violet-400',
      'bg-blue-400',
      'bg-indigo-400',
      'bg-green-400',
      'bg-yellow-400',
      'bg-orange-400',
      'bg-red-400',
      'bg-pink-400',
      'bg-rose-400',
    ],
    shadow = 'shadow-lg shadow-cyan-400/50 rounded-full',
    speed = 4,
  } = beams;

  // Parse grid dimensions
  const [cols, rows] = gridSize.split(':').map(Number);

  // Generate beam configurations
  const animatedBeams = React.useMemo(
    () =>
      Array.from({ length: Math.min(count, 12) }, (_, i) => {
        const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        const startPosition = Math.random() > 0.5 ? 'start' : 'end';

        return {
          id: i,
          color: beamColors[i % beamColors.length],
          direction,
          startPosition,
          // For horizontal beams: choose a row index (1 to rows-1) - exclude edges
          // For vertical beams: choose a column index (1 to cols-1) - exclude edges
          gridLine:
            direction === 'horizontal'
              ? Math.floor(Math.random() * (rows - 1)) + 1
              : Math.floor(Math.random() * (cols - 1)) + 1,
          delay: Math.random() * 2,
          duration: speed + Math.random() * 2,
        };
      }),
    [count, beamColors, speed, cols, rows],
  );

  // Responsively reduce animation density on small screens
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  const gridStyle = {
    '--border-style': borderStyle,
  } as React.CSSProperties;

  return (
    <motion.div
      data-slot="grid-background"
      className={cn('relative size-full overflow-hidden', background, className)}
      style={gridStyle}
      {...props}
    >
      {/* Grid Container */}
      <div
        className={cn('absolute inset-0 size-full', borderColor)}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          borderRightWidth: borderSize,
          borderBottomWidth: borderSize,
          borderRightStyle: borderStyle,
          borderBottomStyle: borderStyle,
        }}
      >
        {/* Grid Cells */}
        {Array.from({ length: cols * rows }).map((_, index) => (
          <div
            key={index}
            className={cn('relative', borderColor)}
            style={{
              borderTopWidth: borderSize,
              borderLeftWidth: borderSize,
              borderTopStyle: borderStyle,
              borderLeftStyle: borderStyle,
            }}
          />
        ))}
      </div>

      {/* Animated Beams */}
      {(isMobile ? animatedBeams.slice(0, 3) : animatedBeams).map((beam) => {
        // Calculate exact grid line positions as percentages
        const horizontalPosition = (beam.gridLine / rows) * 100;
        const verticalPosition = (beam.gridLine / cols) * 100;

        return (
          <motion.div
            key={beam.id}
            className={cn(
              'absolute rounded-full backdrop-blur-sm z-0',
              beam.color,
              beam.direction === 'horizontal' ? 'w-6 h-0.5' : 'w-0.5 h-6',
              shadow,
            )}
            style={{
              ...(beam.direction === 'horizontal'
                ? {
                    // Position exactly on the horizontal grid line
                    top: `${horizontalPosition}%`,
                    left: beam.startPosition === 'start' ? '-12px' : 'calc(100% + 12px)',
                    transform: 'translateY(-50%)', // Center on the line
                  }
                : {
                    // Position exactly on the vertical grid line
                    left: `${verticalPosition}%`,
                    top: beam.startPosition === 'start' ? '-12px' : 'calc(100% + 12px)',
                    transform: 'translateX(-50%)', // Center on the line
                  }),
            }}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              ...(beam.direction === 'horizontal'
                ? {
                    // Traverse the full viewport width plus padding so beams fully exit
                    x: beam.startPosition === 'start'
                      ? [0, 'calc(100vw + 24px)']
                      : [0, 'calc(-100vw - 24px)'],
                  }
                : {
                    // Traverse the full viewport height plus padding so beams fully exit
                    y: beam.startPosition === 'start'
                      ? [0, 'calc(100vh + 24px)']
                      : [0, 'calc(-100vh - 24px)'],
                  }),
            }}
            transition={{
              duration: beam.duration,
              delay: beam.delay,
              repeat: Infinity,
              repeatDelay: Math.random() * 3 + 2, // 2-5s pause between repeats
              ease: 'linear',
              times: [0, 0.1, 0.9, 1], // Quick fade in, maintain, quick fade out
            }}
          />
        );
      })}

      {/* Accent Lines with slow particles */}
      {accentLines?.lines?.map((line, idx) => {
        const isHorizontal = line.orientation === 'horizontal';
        const pos = `${line.positionPercent}%`;
        const thickness = line.thickness ?? '1px';
        const colorClass = line.colorClass ?? 'from-emerald-400/20 to-cyan-400/10';
        const opacity = line.opacity ?? 0.45;
        const insetStart = line.insetStart ?? '8%';
        const insetEnd = line.insetEnd ?? '8%';
        const particlesPerLineBase = Math.min(Math.max(accentLines.particlesPerLine ?? 4, 0), 6);
        const particlesPerLine = isMobile ? Math.min(particlesPerLineBase, 3) : particlesPerLineBase;
        const particleClass = accentLines.particleClass ?? 'bg-emerald-300';
        const baseParticleSize = accentLines.particleSizePx ?? 6;
        const baseParticleSpeed = accentLines.particleSpeedSec ?? 5;

        return (
          <React.Fragment key={`accent-${idx}`}>
            <div
              className={cn(
                'absolute pointer-events-none z-0',
                isHorizontal ? 'h-px w-full' : 'w-px h-full',
              )}
              style={{
                top: isHorizontal ? pos : undefined,
                left: !isHorizontal ? pos : undefined,
                opacity,
              }}
            >
              <div
                className={cn(
                  'absolute',
                  isHorizontal ? 'inset-x-0' : 'inset-y-0',
                )}
                style={{
                  [isHorizontal ? 'left' : 'top']: insetStart,
                  [isHorizontal ? 'right' : 'bottom']: insetEnd,
                } as React.CSSProperties}
              >
                <div
                  className={cn(
                    'bg-gradient-to-r',
                    colorClass,
                    isHorizontal ? '' : 'rotate-90 origin-top-left',
                  )}
                  style={{
                    height: isHorizontal ? thickness : 1,
                    width: isHorizontal ? '100%' : thickness,
                    filter: 'blur(0.2px)',
                  }}
                />
              </div>
            </div>

            {Array.from({ length: particlesPerLine }).map((_, pIdx) => {
              const startX = insetStart;
              const endX = `calc(100% - ${insetEnd})`;
              const startY = insetStart;
              const endY = `calc(100% - ${insetEnd})`;

              const speedFactor = 0.5 + Math.random() * 0.6; // 0.5x - 1.1x
              const particleSpeed = baseParticleSpeed * speedFactor;
              const sizeJitter = Math.max(0.7, Math.min(1.3, 0.85 + Math.random() * 0.5));
              const particleSize = Math.round(baseParticleSize * sizeJitter);
              const reverse = Math.random() > 0.5;
              const delay = Math.random() * 2.5 + pIdx * 0.35;

              return (
                <motion.div
                  key={`accent-p-${idx}-${pIdx}`}
                  className={cn('absolute z-0 rounded-full shadow-[0_0_8px_2px_rgba(16,185,129,0.35)]', particleClass)}
                  style={{
                    width: particleSize,
                    height: particleSize,
                    top: isHorizontal ? pos : startY,
                    left: isHorizontal ? startX : pos,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    left: isHorizontal ? (reverse ? [endX, startX] : [startX, endX]) : undefined,
                    top: !isHorizontal ? (reverse ? [endY, startY] : [startY, endY]) : undefined,
                  }}
                  transition={{
                    duration: particleSpeed,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatType: 'reverse',
                    delay,
                  }}
                />
              );
            })}
          </React.Fragment>
        );
      })}

      {/* Content Layer */}
      <div className="relative z-10 size-full">{children}</div>
    </motion.div>
  );
}

// Dot Background Component
interface DotBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  dotSize?: number;
  dotColor?: string;
  darkDotColor?: string;
  spacing?: number;
  showFade?: boolean;
  fadeIntensity?: number;
  children?: React.ReactNode;
}

const DotBackground = ({
  className,
  children,
  dotSize = 1,
  dotColor = "#000",
  darkDotColor = "#fff",
  spacing = 20,
  showFade = true,
  fadeIntensity = 20,
  ...props
}: DotBackgroundProps) => {
  const [currentDotColor, setCurrentDotColor] = React.useState(dotColor);

  React.useEffect(() => {
    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkModeActive =
      document.documentElement.classList.contains("dark") || prefersDarkMode;
    setCurrentDotColor(isDarkModeActive ? darkDotColor : dotColor);

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "class") {
          const updatedIsDarkModeActive =
            document.documentElement.classList.contains("dark");
          setCurrentDotColor(updatedIsDarkModeActive ? darkDotColor : dotColor);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return function () {
      return observer.disconnect();
    };
  }, [dotColor, darkDotColor]);

  return (
    <div
      className={cn(
        "relative flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: spacing + "px " + spacing + "px", // String concatenation
          backgroundImage:
            "radial-gradient(" +
            currentDotColor +
            " " +
            dotSize +
            "px, transparent " +
            dotSize +
            "px)", // String concatenation
        }}
      />

      {showFade && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white dark:bg-black"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, transparent " +
              fadeIntensity +
              "%, black)", // String concatenation
            WebkitMaskImage:
              "radial-gradient(ellipse at center, transparent " +
              fadeIntensity +
              "%, black)", // String concatenation
          }}
        />
      )}

      <div className="relative z-20">{children}</div>
    </div>
  );
};

// Simple Grid Background Component (from user's code)
interface SimpleGridBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  gridSize?: number;
  gridColor?: string;
  darkGridColor?: string;
  showFade?: boolean;
  fadeIntensity?: number;
  children?: React.ReactNode;
}

const SimpleGridBackground = ({
  className,
  children,
  gridSize = 20,
  gridColor = "#e4e4e7",
  darkGridColor = "#262626",
  showFade = true,
  fadeIntensity = 20,
  ...props
}: SimpleGridBackgroundProps) => {
  const [currentGridColor, setCurrentGridColor] = React.useState(gridColor);

  React.useEffect(() => {
    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDarkModeActive =
      document.documentElement.classList.contains("dark") || prefersDarkMode;
    setCurrentGridColor(isDarkModeActive ? darkGridColor : gridColor);

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.attributeName === "class") {
          const updatedIsDarkModeActive =
            document.documentElement.classList.contains("dark");
          setCurrentGridColor(
            updatedIsDarkModeActive ? darkGridColor : gridColor
          );
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return function () {
      return observer.disconnect();
    };
  }, [gridColor, darkGridColor]);

  return (
    <div
      className={cn(
        "relative flex h-[50rem] w-full items-center justify-center bg-transparent",
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: gridSize + "px " + gridSize + "px", // String concatenation
          backgroundImage:
            "linear-gradient(to right, " +
            currentGridColor +
            " 1px, transparent 1px), " +
            "linear-gradient(to bottom, " +
            currentGridColor +
            " 1px, transparent 1px)", // String concatenation
        }}
      />

      {showFade && (
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white dark:bg-black"
          style={{
            maskImage:
              "radial-gradient(ellipse at center, transparent " +
              fadeIntensity +
              "%, black)", // String concatenation
            WebkitMaskImage:
              "radial-gradient(ellipse at center, transparent " +
              fadeIntensity +
              "%, black)", // String concatenation
          }}
        />
      )}

      <div className="relative z-20">{children}</div>
    </div>
  );
};

export { GridBackground, type GridBackgroundProps };
export { DotBackground, type DotBackgroundProps };
export { SimpleGridBackground, type SimpleGridBackgroundProps };
