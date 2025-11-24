"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center bg-white px-6 py-16 text-slate-800 sm:px-12 lg:px-20">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-slate-50" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-16 text-center">
        <section className="flex flex-col items-center gap-6 sm:gap-8">
          <p className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-4 py-1 text-xs uppercase tracking-[0.35em] text-slate-500">
            Portfolio playground
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Explore <span className="text-orange-500">InstaFlan</span>, my
            Instagram-inspired practice build
          </h1>
          <p className="max-w-3xl text-base text-slate-600 sm:text-lg">
            This project is my sandbox for sharpening full-stack skills with
            Next.js, TypeScript, Tailwind, Express, and MongoDB. Jump in, click
            through the different functionalities, and see how I am recreating
            core social features.
          </p>

          <div className="mt-4 flex w-full flex-col justify-center gap-4 sm:flex-row sm:gap-5">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="group relative flex w-full items-center justify-center rounded-xl bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-sm transition duration-200 hover:bg-orange-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-200 sm:w-auto sm:px-8 sm:text-lg"
            >
              <span className="relative z-10">Sing in</span>
            </button>
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="w-full rounded-xl border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-800 shadow-sm transition duration-200 hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-100 sm:w-auto sm:px-8 sm:text-lg"
            >
              Create an account
            </button>
          </div>

          <div className="mt-6 flex flex-col gap-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:gap-8">
            <div className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              Built with Next.js, Tailwind, Express, and MongoDB
            </div>
            <div className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-orange-400" />
              Focused on learning auth flows, feeds, and collaboration
            </div>
          </div>
        </section>

        <section className="grid w-full gap-6 text-left text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Tour the social experience
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Browse a recreated feed, interact with posts, and validate core UX
              decisions designed to mirror a production Instagram workflow.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">
              Experiment with creator tools
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Try the onboarding, profile customization, and content publishing
              flows that I am iterating on to practice responsive UI patterns.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold text-slate-900">
              Learn the stack story
            </h3>
            <p className="mt-2 text-sm text-slate-600">
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
