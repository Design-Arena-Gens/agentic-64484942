"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import FlowfieldCanvas, { FlowfieldCanvasHandle } from "./FlowfieldCanvas";

export default function Hero() {
  const canvasRef = useRef<FlowfieldCanvasHandle>(null);

  return (
    <section className="relative overflow-hidden">
      {/* Background visuals */}
      <div className="absolute inset-0">
        {/* Subtle grid for structure */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.45) 1px, transparent 0)",
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(to bottom, black, transparent 85%)",
          }}
        />
        {/* Flowing data field */}
        <FlowfieldCanvas ref={canvasRef} />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Top nav */}
        <div className="container mx-auto max-w-7xl px-6 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary-500 to-accent shadow-glow" />
            <span className="text-lg font-semibold tracking-tight">remylar</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-white/70">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">SOC 2 Type II</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">SLA 99.99%</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Latency &lt; 50ms</span>
          </div>
        </div>

        {/* Hero copy */}
        <div className="container mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
              className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]"
            >
              From data to <span className="text-primary-400">workflow intelligence</span> ?
              enterprise AI infra that actually ships outcomes.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl"
            >
              Remylar unifies memory, retrieval, policy, and orchestration so your
              applications learn from operations. Secure by default. Tuned for scale.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="mt-10 flex flex-col sm:flex-row gap-3"
            >
              <a
                href="#demo"
                className="btn btn-primary"
                onMouseEnter={() => canvasRef.current?.burst()}
              >
                Request enterprise demo
              </a>
              <button
                className="btn btn-ghost"
                onClick={() => canvasRef.current?.burst()}
              >
                See interactive dataflow
              </button>
            </motion.div>

            {/* Trust row */}
            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 text-white/50">
              <div className="text-xs">Trusted for:</div>
              <Badge>Audit-ready logging</Badge>
              <Badge>PII-safe vectorization</Badge>
              <Badge>Multi-tenant isolation</Badge>
              <Badge>Deterministic routing</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom curve accent */}
      <div className="pointer-events-none relative z-0">
        <div className="mx-auto max-w-7xl px-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/60">
            <ValueCard title="Operate in real time" value="&lt;50ms" subtitle="End-to-end latency at P95" />
            <ValueCard title="Battle-tested" value="4D9s" subtitle="99.99% availability" />
            <ValueCard title="Scale without chaos" value=">10x" subtitle="Throughput with policy routing" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs">
      <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
      {children}
    </span>
  );
}

function ValueCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-4">
      <div className="text-white/60">{title}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-white">{value}</div>
      <div className="text-white/50">{subtitle}</div>
    </div>
  );
}
