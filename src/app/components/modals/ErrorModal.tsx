"use client";

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

export default function ErrorModal(props: ErrorModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 px-4 backdrop-blur-lg">
      <div className="w-full max-w-sm space-y-5 rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm backdrop-blur-xl sm:p-8">
        <h3 className="text-2xl font-semibold text-slate-900">Something broke</h3>
        <p className="text-sm text-slate-700">{props.message}</p>
        <button
          onClick={props.onClose}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:shadow-xl hover:brightness-110"
        >
          Close
        </button>
      </div>
    </div>
  );
}
