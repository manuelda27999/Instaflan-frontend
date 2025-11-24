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
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-6 py-16 text-slate-800 sm:px-10 lg:px-16">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-slate-50" />

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
