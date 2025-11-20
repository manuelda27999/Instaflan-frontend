"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

import { useModal } from "@/context/ModalContext";
import retrieveChat from "@/lib/api/retrieveChat";
import sendMessage from "@/lib/api/sendMessage";
import retrieveUser from "@/lib/api/retrieveUser";
import ProfileImage from "@/app/components/ProfileImage";
import LoadingModal from "@/app/components/modals/LoadingModal";

interface Chat {
  id: string;
  users: { id: string; name: string; image: string }[];
  messages: Message[];
}

interface Message {
  author: string;
  delete?: boolean;
  edit?: boolean;
  id: string;
  text: string;
}

export default function Chat() {
  const [chat, setChat] = useState<Chat | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [firstLoading, setFirstLoading] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  console.log(isMobile);
  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();
  const router = useRouter();
  const { openModal } = useModal();

  const chatId = useMemo(() => pathname.split("/")[2] ?? "", [pathname]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");

    setIsMobile(query.matches);

    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    query.addEventListener("change", handler);

    return () => query.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!chatId) return;

    let active = true;

    setFirstLoading(true);

    startTransition(() => {
      Promise.all([retrieveUser(), retrieveChat(chatId)])
        .then(([user, newChat]) => {
          if (!active) return;
          setCurrentUserId(user?.id ?? null);
          setChat(newChat);
          setFirstLoading(false);
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    });

    const intervalId = setInterval(() => {
      retrieveChat(chatId)
        .then((newChat) => {
          if (!active) return;
          setChat((prev) =>
            JSON.stringify(prev) === JSON.stringify(newChat) ? prev : newChat
          );
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    }, 2000);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, [chatId, openModal]);

  const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!chatId) return;

    const form = event.target as HTMLFormElement;
    const messageInput = form.elements.namedItem(
      "message"
    ) as HTMLInputElement | null;

    if (!messageInput) return;

    const text = messageInput.value.trim();
    if (!text) return;

    startTransition(() => {
      sendMessage(chatId, text)
        .then(() =>
          retrieveChat(chatId).then((newChat) => {
            messageInput.value = "";
            setChat(newChat);
          })
        )
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    });
  };

  useEffect(() => {
    const pageHeight = document.body.scrollHeight;

    window.scroll({
      top: pageHeight,
      behavior: "smooth",
    });
  }, [chat?.messages.length]);

  const participants =
    chat?.users.filter((user) => user.id !== currentUserId) ?? [];

  const displayParticipants =
    participants.length > 0 ? participants : chat?.users ?? [];

  return (
    <section className="relative flex flex-col items-center pb-16 ">
      {firstLoading && !currentUserId && <LoadingModal />}

      <div className="fixed w-full sm:w-5/6 max-w-4xl sm:rounded-3xl border border-white/10 bg-white/5 px-4 py-2 sm:py-3 shadow-[0_35px_120px_-70px_rgba(56,189,248,0.75)] backdrop-blur-xl sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {displayParticipants.slice(0, 3).map((participant) => (
                <span
                  key={participant.id}
                  className="h-14 w-14 rounded-full overflow-hidden border border-emerald-300/50 shadow-[0_0_30px_-12px_rgba(52,211,153,0.8)]"
                >
                  <ProfileImage
                    key={participant.id}
                    name={participant.name}
                    image={participant.image}
                  />
                </span>
              ))}
            </div>
            <div>
              <Link
                href={`/profile/${displayParticipants[0]?.id}/posts`}
                className="text-sm font-semibold text-white sm:text-base hover:text-emerald-300"
              >
                {displayParticipants.map((user) => user.name).join(", ") ||
                  "Conversation"}
              </Link>
              <p className="text-xs text-slate-300">
                {displayParticipants.length > 1
                  ? "Group chat"
                  : "Direct message"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-100 transition hover:border-emerald-300/40 hover:bg-white/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30"
              type="button"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-24 w-full max-w-4xl">
        {chat?.messages.map((message) => {
          const isOwn = currentUserId && message.author === currentUserId;

          if (message.delete) {
            return (
              <article
                key={message.id}
                className="flex justify-center text-xs italic text-slate-400"
              >
                <span
                  className={`rounded-full border border-white/10 bg-white/5 px-3 py-1 ${
                    isOwn ? "ml-auto" : "mr-auto"
                  }`}
                >
                  Message deleted
                </span>
              </article>
            );
          }

          return (
            <article
              key={message.id}
              className={`flex w-full ${
                isOwn ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[75%] items-end gap-3 ${
                  isOwn ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* {!isOwn && author && (
                  <span className="h-8 w-8 rounded-full overflow-hidden border border-emerald-300/50 shadow-[0_0_30px_-12px_rgba(52,211,153,0.8)]">
                    <ProfileImage name={author.name} image={author.image} />
                  </span>
                )} */}
                <div
                  className={`flex flex-col rounded-3xl border px-3 py-2 text-sm shadow-[0_25px_70px_-55px_rgba(56,189,248,0.8)] ${
                    isOwn
                      ? "border-emerald-300/60 bg-gradient-to-r from-emerald-300/20 via-teal-300/20 to-sky-300/25 text-emerald-50"
                      : "border-white/10 bg-white/5 text-slate-100"
                  }`}
                >
                  <div className="flex flex-row">
                    <div className="flex justify-center items-center">
                      <p className="whitespace-pre-wrap break-words ">
                        {message.text}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      {isOwn && !message.edit && (
                        <button
                          onClick={() =>
                            openModal("edit-delete-message", { message })
                          }
                          className="ml-2 mr-[-4] mb-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-slate-200 transition hover:border-emerald-300/45 hover:bg-emerald-400/10 hover:text-emerald-100"
                          type="button"
                          aria-label="Edit or delete message"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                            <path d="M14.06 7.19l3.75 3.75" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  {message.edit && (
                    <span className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-300/80 ml-auto mt-2">
                      Edited
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="fixed inset-x-0 bottom-21 sm:bottom-24 z-40 px-0.5 pb-0.5 sm:px-6"
      >
        <div className="flex w-full max-w-4xl items-center gap-3 rounded-4xl sm:rounded-3xl border border-white/10 bg-white/5 px-4 py-2 shadow-[0_30px_80px_-60px_rgba(56,189,248,0.7)] backdrop-blur-xl">
          <input
            id="message"
            name="message"
            placeholder="Craft a sweet reply…"
            className="flex-1 rounded-full border border-transparent bg-transparent px-3 py-1 sm:py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300/60 focus:outline-none focus:ring-0"
            type="text"
            autoComplete="off"
          />
          <button
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300 px-3 sm:px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
          >
            {!isMobile && (isPending ? "Sending…" : "Send")}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </form>
    </section>
  );
}
