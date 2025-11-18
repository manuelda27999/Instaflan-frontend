import Link from "next/link";

import RegisterForm from "./RegisterForm";

export default function Register() {
  return (
    <div className="mx-auto flex w-full flex-col gap-12 text-slate-100 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center">
      <section className="order-2 lg:order-1">
        <p className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
          Start today
        </p>
        <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Join the <span className="text-sky-300">InstaFlan</span> community
        </h1>
        <p className="max-w-xl text-base text-slate-300 sm:text-lg">
          Create your account to share your favorite desserts, follow friends,
          and discover daily inspiration from fellow food lovers.
        </p>

        <ul className="mt-8 grid gap-4 text-sm text-slate-200 sm:grid-cols-2">
          <li className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-400/20 text-sky-200">
              ✓
            </span>
            Personalize your profile
          </li>
          <li className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
              ✓
            </span>
            Share stunning food posts
          </li>
          <li className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-400/20 text-purple-200">
              ✓
            </span>
            Follow your favourite creators
          </li>
          <li className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/20 text-amber-200">
              ✓
            </span>
            Stay in sync across devices
          </li>
        </ul>
      </section>

      <div className="order-1 lg:order-2">
        <RegisterForm />
        <div className="mt-6 text-center text-sm text-slate-300">
          Already have an account?{" "}
          <Link
            className="font-semibold text-sky-200 transition hover:text-sky-100"
            href="/login"
          >
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}
