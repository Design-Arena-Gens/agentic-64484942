"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type FlowfieldCanvasHandle = {
  burst: () => void;
};

type Props = {
  className?: string;
  accent?: string; // CSS color string
};

// A lightweight animated flowfield that renders curved particle trails
// representing data turning into workflow intelligence. Field is influenced
// by time, pointer position, and has a subtle rightward bias.
const FlowfieldCanvas = forwardRef<FlowfieldCanvasHandle, Props>(function FlowfieldCanvas(
  { className, accent = "#0FA6FF" },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const burstEnergy = useRef(0);

  useImperativeHandle(ref, () => ({
    burst() {
      burstEnergy.current = 1.0; // will decay in animation loop
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    let width = 0;
    let height = 0;
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const particles: {
      x: number;
      y: number;
      life: number;
      ttl: number;
    }[] = [];

    const desiredCount = 1200; // density target

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = Math.floor(rect.width);
      height = Math.floor(rect.height);
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
    }

    function seedParticles() {
      particles.length = 0;
      for (let i = 0; i < desiredCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          life: Math.random() * 100,
          ttl: 100 + Math.random() * 200,
        });
      }
    }

    // Smooth hash utility for pseudo-coherent noise
    function hash2d(x: number, y: number) {
      const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
      return s - Math.floor(s);
    }

    // Scalar field: layered trig with temporal evolution and pointer influence
    function scalarField(x: number, y: number, t: number) {
      const nx = x / Math.max(width, 1);
      const ny = y / Math.max(height, 1);
      const base =
        Math.sin(2.0 * Math.PI * (nx * 1.1 + t * 0.03)) +
        Math.cos(2.0 * Math.PI * (ny * 1.3 - t * 0.025)) +
        Math.sin(2.0 * Math.PI * (nx * 0.7 + ny * 0.9 + t * 0.02));

      // Pointer influence: radial bump that grows with burstEnergy
      let pointerInfluence = 0;
      if (pointer.current.active) {
        const dx = nx - pointer.current.x;
        const dy = ny - pointer.current.y;
        const r2 = dx * dx + dy * dy;
        pointerInfluence = Math.exp(-r2 * 20.0) * 2.0;
      }
      pointerInfluence += burstEnergy.current * 0.8 * Math.exp(-Math.abs(ny - 0.5) * 3.0);

      return base + pointerInfluence;
    }

    // Derivatives approximated with central differences; velocity is a 90? rotation
    function flowVec(x: number, y: number, t: number) {
      const e = 1.5; // finite difference step in px
      const f1 = scalarField(x + e, y, t);
      const f2 = scalarField(x - e, y, t);
      const f3 = scalarField(x, y + e, t);
      const f4 = scalarField(x, y - e, t);
      const dfx = (f1 - f2) * 0.5;
      const dfy = (f3 - f4) * 0.5;
      // Perpendicular vector to gradient = gentle swirling
      let vx = dfy;
      let vy = -dfx;
      // Rightward enterprise bias: a gentle push towards outcomes
      vx += 0.6;
      return { x: vx, y: vy };
    }

    function step(timeMs: number) {
      const t = timeMs * 0.001;

      // Decay burst energy
      burstEnergy.current *= 0.95;
      if (burstEnergy.current < 0.001) burstEnergy.current = 0;

      // Fading trails
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(10,10,11,0.08)"; // persistent trails
      ctx.fillRect(0, 0, width, height);

      // Draw particles with additive blending for glow
      ctx.globalCompositeOperation = "lighter";

      const baseHue = 200; // ~primary blue
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        if (p.life++ > p.ttl) {
          // recycle near the left with slight vertical noise
          p.x = -10 + hash2d(i, t) * 20;
          p.y = Math.random() * height;
          p.life = 0;
          p.ttl = 100 + Math.random() * 200;
        }
        const v = flowVec(p.x, p.y, t);
        const speed = 0.9 + burstEnergy.current * 1.1;
        const nx = p.x + v.x * speed;
        const ny = p.y + v.y * speed;

        // color varies by y for subtle spectrum depth
        const yNorm = p.y / Math.max(height, 1);
        const hue = baseHue + (yNorm - 0.5) * 20;
        const alpha = 0.08 + burstEnergy.current * 0.06;
        ctx.strokeStyle = `hsla(${hue}, 95%, 60%, ${alpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        p.x = nx;
        p.y = ny;

        if (p.x > width + 10 || p.y < -20 || p.y > height + 20) {
          p.x = -10 + Math.random() * 10;
          p.y = Math.random() * height;
          p.life = 0;
          p.ttl = 100 + Math.random() * 200;
        }
      }

      rafRef.current = requestAnimationFrame(step);
    }

    function onPointerMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      pointer.current.x = (e.clientX - rect.left) / Math.max(rect.width, 1);
      pointer.current.y = (e.clientY - rect.top) / Math.max(rect.height, 1);
      pointer.current.active = true;
    }
    function onPointerLeave() {
      pointer.current.active = false;
    }

    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    resize();
    seedParticles();
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={
        "absolute inset-0 w-full h-full will-change-transform " + (className ?? "")
      }
      aria-hidden="true"
    />
  );
});

export default FlowfieldCanvas;
