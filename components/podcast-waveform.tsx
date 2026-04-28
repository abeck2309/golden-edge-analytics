"use client";

import { useEffect, useMemo, useRef } from "react";

export function PodcastWaveform({
  samples,
  isPlaying
}: {
  samples: number[];
  isPlaying: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);

  const renderedSamples = useMemo(() => {
    if (!isPlaying || !samples.length) {
      return Array.from({ length: Math.max(1, samples.length || 144) }, () => 0);
    }

    return samples.map((sample, index) => {
      const left = samples[Math.max(0, index - 1)] ?? sample;
      const right = samples[Math.min(samples.length - 1, index + 1)] ?? sample;
      return left * 0.12 + sample * 0.76 + right * 0.12;
    });
  }, [isPlaying, samples]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = hostRef.current;

    if (!canvas || !host) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);

      draw(context, width, height, renderedSamples, isPlaying);
    };

    const observer = new ResizeObserver(() => resize());
    observer.observe(host);
    resize();

    return () => observer.disconnect();
  }, [isPlaying, renderedSamples]);

  return (
    <div
      ref={hostRef}
      className="relative mt-5 h-36 overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#050714]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,188,122,0.18),transparent_42%),radial-gradient(circle_at_center,rgba(194,196,198,0.08),transparent_62%),radial-gradient(circle_at_72%_50%,rgba(200,16,46,0.05),transparent_78%)]" />
      <canvas ref={canvasRef} className="relative h-full w-full" />
    </div>
  );
}

function draw(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  samples: number[],
  isPlaying: boolean
) {
  context.clearRect(0, 0, width, height);

  const centerY = height / 2;
  const maxAmplitude = height * 0.46;

  context.strokeStyle = "rgba(255,255,255,0.06)";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, centerY);
  context.lineTo(width, centerY);
  context.stroke();

  const goldGradient = context.createLinearGradient(0, 0, width, 0);
  goldGradient.addColorStop(0, "#8f7234");
  goldGradient.addColorStop(0.18, "#d8bc7a");
  goldGradient.addColorStop(0.5, "#f1dfab");
  goldGradient.addColorStop(0.82, "#d8bc7a");
  goldGradient.addColorStop(1, "#8f7234");

  const silverGradient = context.createLinearGradient(0, 0, width, 0);
  silverGradient.addColorStop(0, "#8f9499");
  silverGradient.addColorStop(0.25, "#C2C4C6");
  silverGradient.addColorStop(0.75, "#e1e3e5");
  silverGradient.addColorStop(1, "#8f9499");

  const accentGradient = context.createLinearGradient(0, 0, width, 0);
  accentGradient.addColorStop(0, "rgba(200,16,46,0)");
  accentGradient.addColorStop(0.22, "rgba(200,16,46,0.08)");
  accentGradient.addColorStop(0.5, "rgba(200,16,46,0.34)");
  accentGradient.addColorStop(0.78, "rgba(200,16,46,0.08)");
  accentGradient.addColorStop(1, "rgba(200,16,46,0)");

  drawStemLayer(context, width, centerY, maxAmplitude, samples, isPlaying);
  drawSignalLayer(context, width, centerY, maxAmplitude, samples, goldGradient, "rgba(216, 188, 122, 0.96)", 24, 2.25, 1);
  drawSignalLayer(context, width, centerY, maxAmplitude * 0.92, samples, silverGradient, "rgba(194, 196, 198, 0.56)", 14, 1.3, 0.72);
  drawSignalLayer(context, width, centerY, maxAmplitude * 0.82, samples, accentGradient, "rgba(200, 16, 46, 0.20)", 10, 0.95, 0.42);
}

function drawStemLayer(
  context: CanvasRenderingContext2D,
  width: number,
  centerY: number,
  maxAmplitude: number,
  samples: number[],
  isPlaying: boolean
) {
  if (!isPlaying) {
    return;
  }

  context.save();
  context.strokeStyle = "rgba(194, 196, 198, 0.14)";
  context.lineWidth = 1;

  const step = width / Math.max(1, samples.length - 1);

  samples.forEach((sample, index) => {
    const amplitude = Math.pow(Math.abs(sample), 1.06) * maxAmplitude * 0.92;

    if (amplitude < 1.2) {
      return;
    }

    const x = index * step;
    context.beginPath();
    context.moveTo(x, centerY - amplitude);
    context.lineTo(x, centerY + amplitude);
    context.stroke();
  });

  context.restore();
}

function drawSignalLayer(
  context: CanvasRenderingContext2D,
  width: number,
  centerY: number,
  maxAmplitude: number,
  samples: number[],
  strokeStyle: CanvasGradient,
  shadowColor: string,
  blur: number,
  lineWidth: number,
  strength: number
) {
  context.save();
  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;
  context.shadowBlur = blur;
  context.shadowColor = shadowColor;
  context.lineCap = "round";
  context.lineJoin = "round";

  const points = samples.map((sample, index) => {
    const position = index / Math.max(1, samples.length - 1);
    const shaped = Math.sign(sample || 0) * Math.pow(Math.abs(sample), 1.08);
    return {
      x: position * width,
      y: centerY + shaped * maxAmplitude * strength
    };
  });

  drawSmoothPath(context, points);
  context.stroke();
  context.restore();
}

function drawSmoothPath(
  context: CanvasRenderingContext2D,
  points: { x: number; y: number }[]
) {
  context.beginPath();
  context.moveTo(points[0]?.x ?? 0, points[0]?.y ?? 0);

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[Math.max(0, index - 1)] ?? points[index];
    const current = points[index];
    const next = points[index + 1];
    const following = points[Math.min(points.length - 1, index + 2)] ?? next;

    const cp1x = current.x + (next.x - previous.x) / 6;
    const cp1y = current.y + (next.y - previous.y) / 6;
    const cp2x = next.x - (following.x - current.x) / 6;
    const cp2y = next.y - (following.y - current.y) / 6;

    context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
  }
}
