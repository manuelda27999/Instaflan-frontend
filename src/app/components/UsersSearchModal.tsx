"use client";

import {
  useEffect,
  useState,
  useRef,
  useTransition,
  type ChangeEvent,
} from "react";
import Image from "next/image";
import searchUser from "@/lib/api/searchUser";
import Link from "next/link";
import ProfileImage from "./ProfileImage";
import { useModal } from "@/context/ModalContext";

interface User {
  id: string;
  name: string;
  image: string;
}

export default function UsersSearchModal() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [textState, setTextState] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [usersList, setUsersList] = useState<boolean>(false);
  const [isSearching, startTransition] = useTransition();
  const { openModal } = useModal();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setUsersList(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleSearchUsers = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;

    if (!text) {
      setUsers([]);
      return;
    }

    if (isSearching || text === textState) {
      return;
    } else {
      setTextState(text);

      startTransition(() => {
        searchUser(text)
          .then((foundUsers) => setUsers(foundUsers))
          .catch((error: unknown) => {
            const message =
              error instanceof Error ? error.message : String(error);
            openModal("error-modal", { message });
          });
      });
    }
  };

  return (
    <div className="relative flex items-center justify-end" ref={containerRef}>
      <div className="relative w-44 sm:w-56">
        <span className="pointer-events-none absolute left-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-slate-300/80">
          <svg
            aria-hidden
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="9" cy="9" r="5.5" />
            <line x1="13.5" y1="13.5" x2="17" y2="17" strokeLinecap="round" />
          </svg>
        </span>
        <input
          onChange={handleSearchUsers}
          onFocus={() => setUsersList(true)}
          className="w-full rounded-full border border-white/15 bg-white/10 pl-9 pr-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 transition focus:border-emerald-300/50 focus:outline-none focus:ring-4 focus:ring-emerald-300/20"
          type="text"
          placeholder="Search creators"
        />
      </div>

      {usersList && (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 space-y-2 rounded-2xl border border-white/10 bg-slate-900/85 p-3 shadow-[0_30px_70px_-35px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
          {isSearching ? (
            <div className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-6">
              <p className="text-sm font-medium text-slate-200">Searching…</p>
            </div>
          ) : users?.length > 0 ? (
            users.map((user) => (
              <Link
                key={user.id}
                href={`/profile/${user.id}/posts`}
                className="group flex items-center gap-3 rounded-xl border border-transparent bg-white/5 px-3 py-2 text-sm font-medium text-slate-100 transition hover:border-emerald-300/40 hover:bg-white/10"
                onClick={() => setUsersList(false)}
              >
                <div className="h-12 w-12 rounded-full overflow-hidden border border-emerald-300/50 shadow-[0_0_30px_-12px_rgba(52,211,153,0.8)]">
                  <ProfileImage name={user.name} image={user.image} />
                </div>
                <span className="flex-1">{user.name}</span>
                <span className="text-xs uppercase tracking-[0.3em] text-emerald-200/70 opacity-0 transition group-hover:opacity-100">
                  View
                </span>
              </Link>
            ))
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-6 text-center">
              <Image
                unoptimized
                width={48}
                height={48}
                className="h-12 w-12 opacity-70"
                src="/images/flan.png"
                alt="Flan mascot"
              />
              <p className="text-sm font-medium text-slate-200">
                No matching creators yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
