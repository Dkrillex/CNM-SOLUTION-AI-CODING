"use client";

import { Eyebrow, GlowOrb, GridBackground } from "@/components/ambient";
import { Counter, EASE } from "@/components/motion";
import { TerminalType } from "@/components/terminal-type";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const SOURCES = [
  "OFAC",
  "UN SECURITY COUNCIL",
  "EU CONSOLIDATED",
  "HM TREASURY",
  "INTERPOL",
  "PEP DATABASE",
  "ADVERSE MEDIA",
  "FATF",
  "WORLD-CHECK",
];

const STATS = [
  { value: 1000, suffix: "+", label: "data sources" },
  { value: 500000, suffix: "+", label: "screenings" },
  { value: 99.9, decimals: 1, suffix: "%", label: "accuracy" },
];

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { ease: EASE } },
};

const fadeTight = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { ease: EASE } },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <GridBackground scan />
      <div className="container grid grid-cols-1 items-center gap-14 py-20 md:py-28 lg:grid-cols-2">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div variants={fadeTight}>
            <Eyebrow>AML × AI · one platform</Eyebrow>
          </motion.div>
          <motion.h1
            variants={fade}
            className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
          >
            Build software.
            <br />
            <span className="text-primary">Screen risk.</span>
            <br />
            Ship compliant.
          </motion.h1>
          <motion.p variants={fade} className="mt-6 max-w-lg text-lg text-muted-foreground">
            cnmsoltion.ai generates production-ready applications and screens entities
            against 1,000+ global data sources — from a single, unified command
            surface.
          </motion.p>
          <motion.div variants={fade} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/builder/studio"
              className="group inline-flex h-12 items-center justify-center rounded-md bg-primary px-7 font-mono text-sm uppercase tracking-widest text-primary-foreground transition-transform hover:-translate-y-0.5 hover:bg-primary/90"
            >
              launch_builder
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/aml/screening"
              className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-background px-7 font-mono text-sm uppercase tracking-widest transition-colors hover:border-primary/40 hover:bg-accent hover:text-primary"
            >
              run_screening
            </Link>
          </motion.div>
          <motion.div variants={fade} className="mt-12 flex gap-8 border-t border-border pt-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-semibold tracking-tight md:text-3xl">
                  <Counter value={s.value} decimals={s.decimals} suffix={s.suffix} />
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="relative"
        >
          <GlowOrb className="-right-10 -top-10 h-64 w-64" />
          <TerminalType />
        </motion.div>
      </div>
      <div className="border-y border-border bg-card/30 py-5">
        <div className="container mb-3">
          <Eyebrow className="text-muted-foreground">
            <span className="text-primary/60">▪</span> trusted data sources
          </Eyebrow>
        </div>
        <div className="group relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex animate-marquee group-hover:[animation-play-state:paused]"
            >
              {[0, 1].map((inner) => (
                <div key={inner} className="flex shrink-0 items-center gap-10 pr-10">
                  {SOURCES.map((s) => (
                    <div key={`${copy}-${inner}-${s}`} className="flex items-center">
                      <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground/70">
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
