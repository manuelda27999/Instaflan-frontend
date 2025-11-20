"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import retrieveChats from "@/lib/api/retrieveChats";
import retrieveUser from "@/lib/api/retrieveUser";
import ProfileImage from "@/app/components/ProfileImage";
import { useModal } from "@/context/ModalContext";
import LoadingModal from "@/app/components/modals/LoadingModal";

interface Chat {
  id: string;
  users: { id: string; name: string; image: string }[];
  messages: Message[];
  unreadFor?: string[];
}

interface Message {
  author: string;
  delete?: boolean;
  edit?: boolean;
  id: string;
  text: string;
}

export default function Messages() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [firstLoading, setFirstLoading] = useState<boolean>(false);
  const { openModal } = useModal();

  useEffect(() => {
    handleChargeUserAndChats();
  }, [openModal]);

  function handleChargeUserAndChats() {
    setFirstLoading(true);
    Promise.all([retrieveUser(), retrieveChats()])
      .then(([user, chats]) => {
        setCurrentUserId(user?.id ?? null);
        setChats(chats);
        setFirstLoading(false);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        openModal("error-modal", { message });
      });
  }

  return (
    <>
      {firstLoading && chats.length === 0 && <LoadingModal />}
      <section className="">
        {chats.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-[0_40px_120px_-70px_rgba(56,189,248,0.7)] backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-300">
              Inbox is clear
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-white">
              No conversations yet
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Start chatting by visiting profiles and sending a direct message.
            </p>
          </div>
        ) : (
          <div className="sm:space-y-4">
            {chats.map((chat) => {
              const hasUnread =
                Boolean(currentUserId) &&
                chat.unreadFor?.includes(currentUserId as string);
              const lastMessage = chat.messages[chat.messages.length - 1];
              const displayUsers = chat.users.filter(
                (user) => user.id !== currentUserId
              );
              const avatars =
                displayUsers.length > 0 ? displayUsers : chat.users;

              return (
                <Link
                  key={chat.id}
                  href={`/messages/${chat.id}`}
                  className={`group flex items-center justify-between gap-4 sm:rounded-3xl border px-4 py-4 shadow-[0_25px_70px_-60px_rgba(56,189,248,0.7)] backdrop-blur-xl transition sm:px-6 ${
                    hasUnread
                      ? "border-emerald-300/50 bg-emerald-400/10 text-white"
                      : "border-white/10 bg-white/5 text-slate-100 hover:border-emerald-300/40 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {avatars.slice(0, 3).map((user) => (
                        <span
                          key={user.id}
                          className="h-12 w-12 rounded-full overflow-hidden border border-emerald-300/50 shadow-[0_0_30px_-12px_rgba(52,211,153,0.8)]"
                        >
                          <ProfileImage
                            key={user.id}
                            name={user.name}
                            image={user.image}
                          />
                        </span>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-semibold sm:text-base">
                        {avatars.map((user) => user.name).join(", ")}
                      </p>
                      <p
                        className={`mt-1 text-xs sm:text-sm ${
                          hasUnread ? "text-emerald-100" : "text-slate-300"
                        }`}
                      >
                        {lastMessage?.text
                          ? lastMessage?.text
                          : "No messages yet"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {hasUnread && (
                      <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-100">
                        New
                      </span>
                    )}
                    <span className="hidden items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-2 text-slate-300 transition group-hover:border-emerald-300/40 group-hover:bg-emerald-400/10 group-hover:text-emerald-200 sm:inline-flex">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M5 12h14" />
                        <path d="M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
