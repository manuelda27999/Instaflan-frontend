"use client";

import { useTransition } from "react";
import deletePost from "@/lib/api/deletePost";
import { useModal } from "@/context/ModalContext";

interface DeletePostModalProps {
  postId: string;
  onDeletePost: () => void;
  onHideDeletePost: () => void;
}

export default function DeletePostModal(props: DeletePostModalProps) {
  const [isPending, startTransition] = useTransition();
  const { openModal } = useModal();

  const handleSubmitPost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(() => {
      deletePost(props.postId)
        .then(() => {
          props.onDeletePost();
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
          props.onHideDeletePost();
        });
    });
  };

  const handleCancelDeletePost = () => props.onHideDeletePost();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 px-4 backdrop-blur-lg">
      <form
        onSubmit={handleSubmitPost}
        className="w-full max-w-sm space-y-6 rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm backdrop-blur-xl sm:p-8"
      >
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em] text-rose-200/80">
            Irreversible action
          </p>
          <h3 className="text-xl font-semibold text-slate-900">
            Delete this post?
          </h3>
          <p className="text-sm text-slate-600">
            This sweet moment will be gone for good. You can’t undo this step.
          </p>
        </header>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={handleCancelDeletePost}
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-800 transition hover:border-emerald-300/40 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-300 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Deleting…" : "Delete"}
          </button>
        </div>
      </form>
    </div>
  );
}
