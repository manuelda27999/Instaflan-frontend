"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import ProfileImage from "./ProfileImage";
import { useUserContext } from "@/context/UserInfoContext";

interface UserInfo {
  id: string;
  name: string;
  avatarUrl: string;
  messageCount: number;
  notificationsCount: number;
}

export default function NavBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserInfo | null>(null);
  console.log("UserInfo in NavBar:", user);

  const { userInfo, updateUserInfo } = useUserContext();

  useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
    }
  }, [userInfo]);

  useEffect(() => {
    updateUserInfo();
  }, [updateUserInfo]);

  const profileHref = useMemo(
    () => (user ? `/profile/${user.id}/posts` : "#"),
    [user]
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
          className={
            active ? "h-5 w-5 text-emerald-600" : "h-5 w-5 text-slate-500"
          }
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
          className={
            active ? "h-5 w-5 text-emerald-600" : "h-5 w-5 text-slate-500"
          }
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
          className={
            active ? "h-5 w-5 text-emerald-600" : "h-5 w-5 text-slate-500"
          }
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
          className={
            active ? "h-5 w-5 text-emerald-600" : "h-5 w-5 text-slate-500"
          }
        >
          <path d="M12 19.5l-6.16-6.16a4.25 4.25 0 010-6 4.25 4.25 0 016 0l.16.16.16-.16a4.25 4.25 0 016 6L12 19.5z" />
        </svg>
      ),
    },
    {
      label: "Profile",
      href: profileHref,
      isActive: (path: string) => path.startsWith("/profile"),
      icon: () =>
        user && <ProfileImage name={user.name} image={user.avatarUrl} />,
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 sm:pb-4 sm:px-6">
      <div className="mx-auto max-w-5xl sm:rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
        <ul className="flex items-center justify-between gap-2">
          {navItems.map((item) => {
            const active = item.isActive(pathname);
            const baseClasses =
              "relative flex flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-2 text-xs font-medium transition";
            const stateClasses = active
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : "text-slate-600 hover:bg-slate-100";

            const disabled = item.label === "Profile" && profileHref === "#";

            return (
              <li key={item.label} className="flex flex-1 justify-center">
                <Link
                  href={item.href}
                  className={`${baseClasses} ${stateClasses} ${
                    disabled ? "pointer-events-none opacity-60" : ""
                  }`}
                  prefetch={item.label !== "Profile" || Boolean(user)}
                >
                  {item.label === "Messages" &&
                    user &&
                    user?.messageCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-400 px-1 text-[0.65rem] font-semibold text-white shadow-sm">
                        {user?.messageCount > 9 ? "9+" : user?.messageCount}
                      </span>
                    )}
                  {item.label === "Activity" &&
                    user &&
                    user?.notificationsCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-400 px-1 text-[0.65rem] font-semibold text-white shadow-sm">
                        {user?.notificationsCount > 9
                          ? "9+"
                          : user?.notificationsCount}
                      </span>
                    )}
                  <div
                    className={`flex h-10 w-10 min-h-10 min-w-10 items-center justify-center rounded-xl border overflow-hidden ${
                      active
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-200 bg-white"
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
