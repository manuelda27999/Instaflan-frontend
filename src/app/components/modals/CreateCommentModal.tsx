"use client";

import { useTransition } from "react";
import createComment from "@/lib/api/createComment";
import { useModal } from "@/context/ModalContext";

interface CreateCommentModalProps {
  postId: string;
  onCreateComment: () => void;
  onHideCreateComment: () => void;
}

export default function CreateCommentModal(props: CreateCommentModalProps) {
  const [isPending, startTransition] = useTransition();
  const { openModal } = useModal();

  const handleSubmitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const text = (form.elements.namedItem("text") as HTMLInputElement).value;

    startTransition(() => {
      createComment(props.postId, text)
        .then(() => {
          props.onCreateComment();
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    });
  };

  const handleCancelCreateComment = () => props.onHideCreateComment();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-lg">
      <form
        onSubmit={handleSubmitComment}
        className="w-full max-w-sm space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_-60px_rgba(56,189,248,0.8)] backdrop-blur-xl sm:p-8"
      >
        <header className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-300">
            Add your voice
          </p>
          <h3 className="text-xl font-semibold text-white">
            Comment on this post
          </h3>
          <p className="text-xs text-slate-300">
            Keep the conversation kind and flan-tastic.
          </p>
        </header>

        <div className="space-y-3">
          <label
            htmlFor="text"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300"
          >
            Message
          </label>
          <textarea
            id="text"
            name="text"
            rows={3}
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300/50 focus:outline-none focus:ring-4 focus:ring-emerald-300/20"
            placeholder="Share a thoughtful note…"
            required
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={handleCancelCreateComment}
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-100 transition hover:border-emerald-300/40 hover:bg-white/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Posting…" : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
