"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";

import retrieveUserById from "@/lib/api/retrieveUserById";
import retrieveUser from "@/lib/api/retrieveUser";
import toggleFollowUser from "@/lib/api/toggleFollowUser";
import createChat from "@/lib/api/createChat";
import { useModal } from "@/context/ModalContext";

import EditUserModal from "../../../components/modals/EditUserModal";
import FollowedModal from "../../../components/modals/FollowedModal";
import FollowingModal from "../../../components/modals/FollowingModal";
import ProfileImage from "@/app/components/ProfileImage";
import LoadingModal from "@/app/components/modals/LoadingModal";

interface User {
  name: string;
  image: string;
  description: string;
  followed?: string[];
  following?: string[];
  follow?: boolean;
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { modalState, closeModal, openModal } = useModal();

  const userIdProfile = pathname.split("/")[2];

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isPending, startTransition] = useTransition();

  const updateUser = useCallback(() => {
    retrieveUserById(userIdProfile)
      .then((profile) => {
        setUserProfile(profile);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        openModal("error-modal", { message });
      });
  }, [userIdProfile, openModal]);

  useEffect(() => {
    let active = true;

    Promise.all([retrieveUser(), retrieveUserById(userIdProfile)])
      .then(([currentUser, profile]) => {
        if (!active) return;
        setCurrentUserId(currentUser?.id ?? null);
        setUserProfile(profile);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        openModal("error-modal", { message });
      });

    return () => {
      active = false;
    };
  }, [userIdProfile, openModal]);

  const handleFollowUser = () => {
    startTransition(() => {
      toggleFollowUser(userIdProfile)
        .then(() => retrieveUserById(userIdProfile))
        .then((profile) => setUserProfile(profile))
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    });
  };

  const handleSendMessageModal = () => {
    startTransition(() => {
      createChat(userIdProfile)
        .then((chatId) => {
          router.push(`/messages/${chatId}`);
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    });
  };

  const followerCount = userProfile?.followed?.length ?? 0;
  const followingCount = userProfile?.following?.length ?? 0;

  return (
    <>
      {!userProfile && !currentUserId && <LoadingModal />}

      <section className="">
        <div className="relative overflow-hidden sm:rounded-3xl sm:mb-3 border border-slate-200 bg-white px-5 py-6 shadow-sm sm:px-8 sm:py-8">
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {userProfile && (
                <span className="w-22 h-22 min-w-22 min-h-22 rounded-full overflow-hidden border border-emerald-300/50 shadow-[0_0_30px_-12px_rgba(249,115,22,0.35)]">
                  <ProfileImage
                    name={userProfile.name}
                    image={userProfile.image}
                  />
                </span>
              )}
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                  {userProfile?.name}
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-600 sm:text-base">
                  {userProfile?.description || "No bio yet – time to add one!"}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:items-end">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openModal("followed-modal")}
                  className="group inline-flex min-w-[6rem] flex-col items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700 transition hover:border-emerald-300/40 hover:bg-white"
                >
                  <span className="text-lg text-emerald-700">
                    {followerCount}
                  </span>
                  Followers
                </button>
                <button
                  onClick={() => openModal("following-modal")}
                  className="group inline-flex min-w-[6rem] flex-col items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-700 transition hover:border-emerald-300/40 hover:bg-white"
                >
                  <span className="text-lg text-emerald-700">
                    {followingCount}
                  </span>
                  Following
                </button>
              </div>

              {currentUserId === userIdProfile ? (
                <button
                  onClick={() => {
                    if (!userProfile) return;
                    openModal("edit-user-modal", {
                      user: userProfile,
                      callback: (close: () => void) => {
                        updateUser();
                        close();
                      },
                    });
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-800 transition hover:border-emerald-300/40 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30"
                >
                  Edit profile
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleFollowUser}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending
                      ? "Updating…"
                      : userProfile?.follow
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                  <button
                    onClick={handleSendMessageModal}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-800 transition hover:border-emerald-300/40 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? "Opening…" : "Direct"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:mb-3 sm:rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm backdrop-blur-xl">
          <button
            onClick={() => router.push(`/profile/${userIdProfile}/posts`)}
            className={`inline-flex items-center gap-2 rounded-full border  px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-800 transition hover:border-emerald-300/40 hover:bg-emerald-200/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30 ${
              pathname.endsWith("/posts")
                ? "bg-emerald-100/20 border-emerald-200/50"
                : "bg-white border-slate-200"
            }`}
          >
            {currentUserId === userIdProfile ? "My posts" : "Profile posts"}
          </button>
          <button
            onClick={() => router.push(`/profile/${userIdProfile}/fav-posts`)}
            className={`inline-flex items-center gap-2 rounded-full border  px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-800 transition hover:border-emerald-300/40 hover:bg-emerald-100/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30 ${
              pathname.endsWith("/fav-posts")
                ? "bg-emerald-100/20 border-emerald-200/50"
                : "bg-white border-slate-200"
            }`}
          >
            {currentUserId === userIdProfile
              ? "My favorite posts"
              : "Favorite profile posts"}
          </button>
        </div>

        <main className="">{children}</main>

        {currentUserId === userIdProfile && (
          <div className="fixed w-full pr-2.5 max-w-4xl bottom-24 sm:bottom-28 z-30 flex flex-col items-end">
            <button
              onClick={() =>
                openModal("create-post-modal", {
                  callback: (close: () => void) => {
                    close();
                  },
                })
              }
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:shadow-xl hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/40"
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
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              New Post
            </button>
          </div>
        )}

        {modalState && modalState.name === "edit-user-modal" && (
          <EditUserModal
            user={modalState.props.user}
            onEditUser={() => {
              modalState.props.callback?.(closeModal);
            }}
            onHideEditUser={() => closeModal()}
          />
        )}
        {modalState && modalState.name === "followed-modal" && (
          <FollowedModal onHideFollowedModal={() => closeModal()} />
        )}
        {modalState && modalState.name === "following-modal" && (
          <FollowingModal onHideFollowingModal={() => closeModal()} />
        )}
      </section>
    </>
  );
}
