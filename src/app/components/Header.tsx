"use client";

import { useState, useEffect, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import usePageTitle from "@/lib/helpers/usePageTittle";
import UsersSearchModal from "@/app/components/UsersSearchModal";
import { deleteSession } from "@/lib/helpers/session";
import { useModal } from "@/context/ModalContext";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [page, setPage] = useState("Instaflan");
  const pageTitle = usePageTitle(pathname);
  const [isPending, startTransition] = useTransition();
  const { openModal } = useModal();

  useEffect(() => {
    setPage(pageTitle);
  }, [pathname, pageTitle]);

  const handleLogout = () => {
    startTransition(() => {
      deleteSession()
        .then(() => {
          router.push("/login");
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    });
  };

  const taglineMap: Record<string, string> = {
    Instaflan: "Your curated feed",
    Explorer: "Discover new creators",
    Messages: "Keep every conversation flowing",
    Notifications: "Catch up on fresh activity",
    Profile: "Share your world with the feed",
  };

  const tagLine = taglineMap[page] ?? "Stay connected";

  return (
    <header className="fixed inset-x-0 top-0 z-20 sm:pt-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between sm:rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-3 shadow-[0_35px_120px_-60px_rgba(56,189,248,0.6)] backdrop-blur-xl sm:px-6">
        <div className="flex items-center gap-4">
          {/* <div className="h-12 w-12 hidden sm:flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300/80 via-teal-300/70 to-sky-400/80 shadow-[0_12px_50px_-20px_rgba(56,189,248,0.8)]">
            {page === "Instaflan" ? (
              <Image
                unoptimized
                width={36}
                height={36}
                className="h-8 w-8 object-contain"
                src="/images/flan.png"
                alt="InstaFlan mascot"
              />
            ) : (
              <span className="text-lg font-semibold text-slate-900">
                {page.slice(0, 1)}
              </span>
            )}
          </div> */}
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-300/80 hidden sm:inline">
              {tagLine}
            </p>
            <h1 className="text-lg font-semibold text-white sm:text-xl">
              {page}
            </h1>
          </div>
        </div>

        {page === "Profile" ? (
          <button
            onClick={handleLogout}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-300/40 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Logging out..." : "Log out"}
          </button>
        ) : (
          <UsersSearchModal />
        )}
      </div>
    </header>
  );
}
