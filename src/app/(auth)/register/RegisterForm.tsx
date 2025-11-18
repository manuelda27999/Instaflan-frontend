"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import registerUser from "@/lib/api/registerUser";
import { useModal } from "@/context/ModalContext";

type RegisterState = { error: string | null };

const initialState: RegisterState = { error: null };

function RegisterForm() {
  const router = useRouter();
  const { openModal } = useModal();

  const [state, registerAction, isPending] = useActionState(
    async (
      _prev: RegisterState,
      formData: FormData
    ): Promise<RegisterState> => {
      try {
        const rawName = formData.get("name");
        const rawEmail = formData.get("email");
        const rawPassword = formData.get("password");

        await registerUser(
          typeof rawName === "string" ? rawName : "",
          typeof rawEmail === "string" ? rawEmail : "",
          typeof rawPassword === "string" ? rawPassword : ""
        );

        router.push("/login");
        return { error: null };
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);

        return { error: message };
      }
    },
    initialState
  );

  useEffect(() => {
    if (!state.error) return;

    openModal("error-modal", {
      message: state.error,
    });
  }, [state.error, openModal]);

  return (
    <form
      action={registerAction}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/75 p-8 shadow-[0_40px_80px_-40px_rgba(15,23,42,0.9)] backdrop-blur-xl transition duration-500 hover:border-white/20 sm:p-10"
    >
      <div className="pointer-events-none absolute -top-20 right-[-4rem] h-48 w-48 rounded-full bg-purple-300/15 blur-3xl animate-glow" />
      <div className="pointer-events-none absolute bottom-[-6rem] left-[-2rem] h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl animate-float" />

      <div className="relative z-10 space-y-8">
        <header className="space-y-2 text-center sm:text-left">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Create your account
          </h2>
          <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
            Join the community, share your favorite recipes, and discover what
            others are cooking up.
          </p>
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="name"
            >
              Full name
            </label>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Jhon Doe"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-slate-100 placeholder:text-slate-400 transition focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-300/30"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="email"
            >
              Email address
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-slate-100 placeholder:text-slate-400 transition focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-300/30"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="********"
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-base text-slate-100 placeholder:text-slate-400 transition focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-300/30"
                required
              />
            </div>
          </div>
        </div>

        <SubmitButton pending={isPending} />

        <p className="text-center text-xs text-slate-400 sm:text-left">
          We respect your privacy. Your data is protected and never shared
          without consent.
        </p>
      </div>
    </form>
  );
}

function SubmitButton({ pending }: { pending?: boolean }) {
  const { pending: statusPending } = useFormStatus();
  const disabled = Boolean(pending || statusPending);

  return (
    <button
      disabled={disabled}
      type="submit"
      className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-300 px-5 py-3 text-lg font-semibold text-slate-900 shadow-lg transition duration-300 hover:shadow-xl hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span className="absolute inset-0 bg-white/40 opacity-0 transition duration-300 group-hover:opacity-100" />
      <span className="relative z-10">
        {disabled ? "Creating account..." : "Create account"}
      </span>
    </button>
  );
}

export default RegisterForm;
