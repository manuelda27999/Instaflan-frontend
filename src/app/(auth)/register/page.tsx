import Link from "next/link";

import RegisterForm from "./RegisterForm";

export default function Register() {
  return (
    <div className="mx-auto flex w-full flex-col gap-12 text-slate-800 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center">
      <section className="order-2 lg:order-1">
        <p className="mb-4 inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-500">
          Start today
        </p>
        <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
          Join the <span className="text-orange-500">InstaFlan</span> community
        </h1>
        <p className="max-w-xl text-base text-slate-600 sm:text-lg">
          Create your account to share your favorite desserts, follow friends,
          and discover daily inspiration from fellow food lovers.
        </p>

        <ul className="mt-8 grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
          <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              ✓
            </span>
            Personalize your profile
          </li>
          <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              ✓
            </span>
            Share stunning posts
          </li>
          <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              ✓
            </span>
            Follow your favourite creators
          </li>
          <li className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              ✓
            </span>
            Stay in sync across devices
          </li>
        </ul>
      </section>

      <div className="order-1 lg:order-2">
        <RegisterForm />
        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            className="font-semibold text-orange-500 transition hover:text-orange-600"
            href="/login"
          >
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
}
