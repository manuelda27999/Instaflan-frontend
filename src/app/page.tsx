"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-16 sm:px-12 lg:px-20">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl animate-float" />
        <div className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-sky-300/15 blur-3xl animate-glow" />
        <div className="absolute bottom-[-6rem] right-[-4rem] h-96 w-96 rounded-full bg-purple-400/20 blur-3xl animate-float" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-16 text-center text-slate-100">
        <section className="flex flex-col items-center gap-6 sm:gap-8">
          <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.4em] text-slate-300">
            Portfolio playground
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Explore <span className="text-emerald-300">InstaFlan</span>, my
            Instagram-inspired practice build
          </h1>
          <p className="max-w-3xl text-base text-slate-300 sm:text-lg">
            This project is my sandbox for sharpening full-stack skills with
            Next.js, TypeScript, Tailwind, Express, and MongoDB. Jump in, click
            through the flows, and see how I am recreating core social features.
          </p>

          <div className="mt-4 flex w-full flex-col justify-center gap-4 sm:flex-row sm:gap-5">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300 px-6 py-3 text-base font-semibold text-slate-900 shadow-lg transition duration-300 hover:shadow-xl hover:brightness-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/40 sm:w-auto sm:px-8 sm:text-lg"
            >
              <span className="absolute inset-0 bg-white/40 opacity-0 transition duration-300 group-hover:opacity-100" />
              <span className="relative z-10">Open the demo</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-slate-100 transition duration-300 hover:border-white/30 hover:bg-white/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/30 sm:w-auto sm:px-8 sm:text-lg"
            >
              Create an account
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-4 text-sm text-slate-300 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex items-center justify-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Built with Next.js, Tailwind, Express, and MongoDB
            </div>
            <div className="flex items-center justify-center gap-2 rounded-full border border-white/5 bg-white/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-sky-300" />
              Focused on learning auth flows, feeds, and collaboration
            </div>
          </div>
        </section>

        <section className="grid w-full gap-6 text-left text-slate-100 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-lg font-semibold text-white">
              Tour the social experience
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Browse a recreated feed, interact with posts, and validate core UX
              decisions designed to mirror a production Instagram workflow.
            </p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h3 className="text-lg font-semibold text-white">
              Experiment with creator tools
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Try the onboarding, profile customization, and content publishing
              flows that I am iterating on to practice responsive UI patterns.
            </p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold text-white">
              Learn the stack story
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              From API design with Express to data modeling in MongoDB and UI
              polish in Next.js, this build captures how I approach modern web
              architecture end-to-end.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
