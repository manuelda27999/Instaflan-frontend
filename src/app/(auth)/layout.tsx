"use client";

import ErrorModal from "@/app/components/modals/ErrorModal";
import { useModal } from "@/context/ModalContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { modalState, closeModal } = useModal();

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-16 sm:px-10 lg:px-16">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl animate-float" />
        <div className="absolute bottom-[-6rem] right-[-4rem] h-80 w-80 rounded-full bg-purple-400/20 blur-3xl animate-glow" />
        <div className="absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-sky-300/10 blur-3xl animate-float" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">{children}</div>

      {modalState && modalState.name === "error-modal" && (
        <ErrorModal
          message={modalState.props.message}
          onClose={() => {
            modalState.props.callback?.(closeModal);
            closeModal();
          }}
        />
      )}
    </main>
  );
}
