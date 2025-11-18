import Link from "next/link";
import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <div className="mx-auto flex w-full flex-col gap-12 text-slate-100 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center">
      <section className="order-2 text-slate-100 lg:order-1">
        <p className="mb-4 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
          Welcome back
        </p>
        <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Access your <span className="text-emerald-300">InstaFlan</span> feed
        </h1>
        <p className="max-w-xl text-base text-slate-300 sm:text-lg">
          Log in to continue sharing your sweet moments, explore new posts, and
          stay in touch with your community. Your dashboard is just one step
          away.
        </p>

        <ul className="mt-8 grid gap-4 text-sm text-slate-200 sm:grid-cols-2">
          <li className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-200">
              ✓
            </span>
            Secure authentication
          </li>
          <li className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-400/20 text-sky-200">
              ✓
            </span>
            Personalized home feed
          </li>
          <li className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-400/20 text-purple-200">
              ✓
            </span>
            Real-time interactions
          </li>
          <li className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/20 text-amber-200">
              ✓
            </span>
            Seamless cross-device access
          </li>
        </ul>
      </section>

      <div className="order-1 lg:order-2">
        <LoginForm />
        <div className="mt-6 text-center text-sm text-slate-300">
          Don&apos;t have an account?{" "}
          <Link
            className="font-semibold text-emerald-200 transition hover:text-emerald-100"
            href="/register"
          >
            Create one here
          </Link>
        </div>
      </div>
    </div>
  );
}
