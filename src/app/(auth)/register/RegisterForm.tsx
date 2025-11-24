"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import registerUser from "@/lib/api/registerUser";
import { useModal } from "@/context/ModalContext";
import LoadingModal from "@/app/components/modals/LoadingModal";

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
    <>
      {isPending && <LoadingModal />}
      <form
        action={registerAction}
        className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-200 sm:p-10"
      >
        <div className="relative z-10 space-y-8">
          <header className="space-y-2 text-center sm:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Create your account
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Join the community, share your favorite recipes, and discover what
              others are cooking up.
            </p>
          </header>

          <div className="space-y-6">
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700"
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 transition focus:border-orange-200 focus:outline-none focus:ring-4 focus:ring-orange-100"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700"
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 transition focus:border-orange-200 focus:outline-none focus:ring-4 focus:ring-orange-100"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-700"
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
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 transition focus:border-orange-200 focus:outline-none focus:ring-4 focus:ring-orange-100"
                  required
                />
              </div>
            </div>
          </div>

          <SubmitButton pending={isPending} />

          <p className="text-center text-xs text-slate-500 sm:text-left">
            We respect your privacy. Your data is protected and never shared
            without consent.
          </p>
        </div>
      </form>
    </>
  );
}

function SubmitButton({ pending }: { pending?: boolean }) {
  const { pending: statusPending } = useFormStatus();
  const disabled = Boolean(pending || statusPending);

  return (
    <button
      disabled={disabled}
      type="submit"
      className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-lg font-semibold text-white shadow-sm transition duration-200 hover:bg-orange-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span>{disabled ? "Creating account..." : "Create account"}</span>
    </button>
  );
}

export default RegisterForm;
