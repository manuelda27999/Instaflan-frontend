"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import Image from "next/image";

import deleteNotification from "@/lib/api/deleteNotification";
import deleteAllNotifications from "@/lib/api/deleteAllNotifications";
import retrieveNotifications from "@/lib/api/retrieveNotifications";
import ProfileImage from "@/app/components/ProfileImage";
import Link from "next/link";
import { useModal } from "@/context/ModalContext";
import { userContext } from "@/context/UserInfoContext";
import LoadingModal from "@/app/components/modals/LoadingModal";

interface Notification {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  post?: {
    image: string;
  };
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [idNotificationToDelete, setIdNotificationToDelete] = useState<
    string | null
  >(null);
  const [isPendingOne, startTransitionOne] = useTransition();
  const [isPendingAll, startTransitionAll] = useTransition();
  const { openModal } = useModal();
  const { updateUserInfo } = userContext();

  const loadNotifications = useCallback(() => {
    setLoading(true);
    retrieveNotifications()
      .then((notifications: Notification[]) => {
        setNotifications(notifications);
        setLoading(false);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        openModal("error-modal", { message });
      });
  }, [openModal]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleDeleteNotification = (notificationId: string) => {
    setIdNotificationToDelete(notificationId);
    startTransitionOne(() => {
      deleteNotification(notificationId)
        .then(() => {
          loadNotifications();
          setIdNotificationToDelete(null);
          updateUserInfo();
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    });
  };

  const handleDeleteAllNotifications = () => {
    startTransitionAll(() => {
      deleteAllNotifications()
        .then(() => {
          loadNotifications();
          updateUserInfo();
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    });
  };

  return (
    <>
      {loading && notifications.length === 0 && <LoadingModal />}

      <section className="">
        {notifications.length === 0 ? (
          <div className="sm:rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-600">
              All quiet
            </p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">
              No notifications yet
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Engage with the community to start seeing likes, follows, and
              comments appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-center py-4">
              <button
                onClick={handleDeleteAllNotifications}
                disabled={isPendingAll}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-slate-800 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPendingAll ? "Cleaning…" : "Clear all"}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M5 7h14" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M6 7l1 12a1.5 1.5 0 001.5 1.5h7a1.5 1.5 0 001.5-1.5l1-12" />
                  <path d="M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7" />
                </svg>
              </button>
            </div>
            <div className="sm:space-y-4">
              {notifications.map((notification) => {
                const isFollow = notification.text === "Follow";
                const isLike = notification.text === "Like";
                const isComment = notification.text === "Comment";

                return (
                  <article
                    key={notification.id}
                    className="flex items-center gap-4 sm:rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm backdrop-blur-xl transition hover:border-emerald-300/40 hover:bg-white sm:px-6"
                  >
                    <Link
                      href={`/profile/${notification.user.id}/posts`}
                      className="h-16 w-16 rounded-full overflow-hidden border border-emerald-300/50 shadow-[0_0_30px_-12px_rgba(52,211,153,0.8)]"
                    >
                      <ProfileImage
                        name={notification.user.name}
                        image={notification.user.image}
                      />
                    </Link>

                    <div className="flex flex-row items-center justify-between flex-1 min-w-0 gap-4">
                      <div>
                        <Link
                          href={`/profile/${notification.user.id}/posts`}
                          className="text-sm font-semibold text-slate-900 transition hover:text-emerald-600"
                        >
                          {notification.user.name}
                        </Link>
                        <p className="text-xs text-slate-600 sm:text-sm">
                          {isFollow && "started following you."}
                          {isLike && "liked your post."}
                          {isComment && "commented on your post."}
                        </p>
                      </div>

                      {notification.post && (isLike || isComment) && (
                        <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white p-1">
                          <Image
                            unoptimized
                            width={120}
                            height={120}
                            className="h-18 w-auto rounded-xl"
                            src={
                              notification.post.image ||
                              "/images/image-not-available.webp"
                            }
                            alt="Post preview"
                            onError={(event) => {
                              const target = event.target as HTMLImageElement;
                              target.src = "/images/image-not-available.webp";
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
                      aria-label="Delete notification"
                    >
                      {isPendingOne &&
                      idNotificationToDelete === notification.id ? (
                        <div className="p-2">
                          <p className="loader-small"></p>
                        </div>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6"
                        >
                          <path d="M5 7h14" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M6 7l1 12a1.5 1.5 0 001.5 1.5h7a1.5 1.5 0 001.5-1.5l1-12" />
                          <path d="M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7" />
                        </svg>
                      )}
                    </button>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>
    </>
  );
}
