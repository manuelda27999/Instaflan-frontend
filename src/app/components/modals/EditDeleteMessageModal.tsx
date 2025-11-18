"use client";

import { useTransition } from "react";
import deleteMessage from "@/lib/api/deleteMessage";
import editMessage from "@/lib/api/editMessage";
import { useModal } from "@/context/ModalContext";

interface EditDeleteMessageModalProps {
  message: Message;
  onHideEditDeletePost: () => void;
}

interface Message {
  author: string;
  delete?: boolean;
  edit?: boolean;
  id: string;
  text: string;
}

export default function EditDeleteMessageModal(
  props: EditDeleteMessageModalProps
) {
  const { openModal } = useModal();
  const message = props.message;

  const [isPending, startTransition] = useTransition();

  const handleEditMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const text = (form.elements.namedItem("text") as HTMLInputElement).value;

    startTransition(() => {
      editMessage(message.id, text)
        .then(() => {
          props.onHideEditDeletePost();
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    });
  };

  const handleDeleteMessage = () => {
    startTransition(() => {
      deleteMessage(message.id)
        .then(() => {
          props.onHideEditDeletePost();
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    });
  };

  const handleCancelEditDeleteMessage = () => props.onHideEditDeletePost();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-lg">
      {message && (
        <form
          onSubmit={handleEditMessage}
          className="w-full max-w-sm space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_40px_120px_-60px_rgba(56,189,248,0.8)] backdrop-blur-xl sm:p-8"
        >
          <header className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-300">
              Tweak your reply
            </p>
            <h3 className="text-xl font-semibold text-white">
              Edit or delete message
            </h3>
            <p className="text-xs text-slate-300">
              Keep conversations polished by updating or removing this note.
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
              defaultValue={message.text || ""}
              className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300/50 focus:outline-none focus:ring-4 focus:ring-emerald-300/20"
              placeholder="Update your message…"
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? "Saving…" : "Save"}
              </button>
              <button
                onClick={handleDeleteMessage}
                type="button"
                disabled={isPending}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-300 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
            <button
              onClick={handleCancelEditDeleteMessage}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-100 transition hover:border-emerald-300/40 hover:bg-white/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
