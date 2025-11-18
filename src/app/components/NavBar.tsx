"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import retrieveUser from "@/lib/api/retrieveUser";
import retrieveChats from "@/lib/api/retrieveChats";
import ProfileImage from "./ProfileImage";
import { useModal } from "@/context/ModalContext";

interface User {
  id: string;
  name: string;
  image: string;
}

interface Chat {
  id: string;
  participants: string[];
  unreadFor: string[];
}

export default function NavBar() {
  const pathname = usePathname();
  const [userIdProfile, setUserIdProfile] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [messagesNotReading, setMessagesNotReading] = useState<number>(0);
  const { openModal } = useModal();

  useEffect(() => {
    let active = true;
    let currentUserId: string | null = null;

    const fetchChats = (userId: string | null) => {
      retrieveChats()
        .then((chats) => {
          if (!active) return;

          const counter = chats.reduce((total: number, chat: Chat) => {
            if (!userId) return total;
            return chat.unreadFor.includes(userId) ? total + 1 : total;
          }, 0);

          setMessagesNotReading(counter);
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    };

    retrieveUser()
      .then((userData) => {
        if (!active) return;
        setUser(userData);
        currentUserId = userData?.id ?? null;
        setUserIdProfile(currentUserId);
        fetchChats(currentUserId);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        openModal("error-modal", { message });
      });
    return () => {
      active = false;
    };
  }, [openModal]);

  const profileHref = useMemo(
    () => (userIdProfile ? `/profile/${userIdProfile}/posts` : "#"),
    [userIdProfile]
  );

  const navItems = [
    {
      label: "Home",
      href: "/home",
      isActive: (path: string) => path === "/home",
      icon: (active: boolean) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Home"
          focusable="false"
          className={active ? "h-5 w-5 text-emerald-200" : "h-5 w-5 text-white"}
        >
          <path d="M3.5 10.5L12 4l8.5 6.5" />
          <path d="M5 10.5V19a1.5 1.5 0 001.5 1.5H17.5A1.5 1.5 0 0019 19v-8.5" />
          <path d="M9.5 21V14h5v7" />
        </svg>
      ),
    },
    {
      label: "Explore",
      href: "/explorer",
      isActive: (path: string) => path.startsWith("/explorer"),
      icon: (active: boolean) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Explore"
          focusable="false"
          className={active ? "h-5 w-5 text-emerald-200" : "h-5 w-5 text-white"}
        >
          <circle cx="12" cy="12" r="8.5" />
          <path d="M9.5 14.5l1.5-4.5 4.5-1.5-1.5 4.5-4.5 1.5z" />
        </svg>
      ),
    },
    {
      label: "Messages",
      href: "/messages",
      isActive: (path: string) => path.startsWith("/messages"),
      icon: (active: boolean) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Messages"
          focusable="false"
          className={active ? "h-5 w-5 text-emerald-200" : "h-5 w-5 text-white"}
        >
          <path d="M3.5 5.5h17a1 1 0 011 1v10a1 1 0 01-1 1h-17a1 1 0 01-1-1v-10a1 1 0 011-1z" />
          <path d="M4.5 7.5l7.5 5 7.5-5" />
        </svg>
      ),
    },
    {
      label: "Activity",
      href: "/notifications",
      isActive: (path: string) => path.startsWith("/notifications"),
      icon: (active: boolean) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-label="Activity"
          focusable="false"
          className={active ? "h-5 w-5 text-emerald-200" : "h-5 w-5 text-white"}
        >
          <path d="M12 19.5l-6.16-6.16a4.25 4.25 0 010-6 4.25 4.25 0 016 0l.16.16.16-.16a4.25 4.25 0 016 6L12 19.5z" />
        </svg>
      ),
    },
    {
      label: "Profile",
      href: profileHref,
      isActive: (path: string) => path.startsWith("/profile"),
      icon: () => user && <ProfileImage name={user.name} image={user.image} />,
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 sm:px-6">
      <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-slate-900/70 px-3 py-3 shadow-[0_-35px_120px_-70px_rgba(56,189,248,0.65)] backdrop-blur-xl">
        <ul className="flex items-center justify-between">
          {navItems.map((item) => {
            const active = item.isActive(pathname);
            const baseClasses =
              "relative flex flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-2 text-xs font-medium transition";
            const stateClasses = active
              ? "bg-white/10 text-white shadow-inner shadow-emerald-500/20"
              : "text-slate-300 hover:bg-white/5 hover:text-white";

            const disabled = item.label === "Profile" && profileHref === "#";

            return (
              <li key={item.label} className="flex flex-1 justify-center">
                <Link
                  href={item.href}
                  className={`${baseClasses} ${stateClasses} ${
                    disabled ? "pointer-events-none opacity-60" : ""
                  }`}
                  prefetch={item.label !== "Profile" || Boolean(userIdProfile)}
                >
                  {item.label === "Messages" && messagesNotReading > 0 && (
                    <span className="absolute -top-1 right-3 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-400 px-1 text-[0.65rem] font-semibold text-slate-900 shadow-lg">
                      {messagesNotReading > 9 ? "9+" : messagesNotReading}
                    </span>
                  )}
                  <div
                    className={`flex h-10 w-10 min-h-10 min-w-10 items-center justify-center rounded-xl border overflow-hidden ${
                      active
                        ? "border-emerald-300/50 bg-gradient-to-br from-emerald-300/20 via-teal-300/20 to-sky-300/20"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    {item.icon(active)}
                  </div>
                  <span className="hidden text-[0.7rem] tracking-wide md:inline">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
