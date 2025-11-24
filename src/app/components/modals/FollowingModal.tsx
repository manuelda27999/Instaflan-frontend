import { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";

import toggleFollowUser from "@/lib/api/toggleFollowUser";
import retrieveFollowing from "@/lib/api/retrieveFollowing";
import retrieveUser from "@/lib/api/retrieveUser";
import ProfileImage from "../ProfileImage";
import Link from "next/link";
import { useModal } from "@/context/ModalContext";

interface FollowedModalProps {
  onHideFollowingModal: () => void;
}

interface User {
  id: string;
  name: string;
  image: string;
  follow: boolean;
}

export default function FollowingModal(props: FollowedModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { openModal } = useModal();

  const pathname = usePathname();
  const userIdProfile = pathname.split("/")[2];

  useEffect(() => {
    Promise.all([retrieveUser(), retrieveFollowing(userIdProfile)])
      .then(([user, following]) => {
        setCurrentUserId(user?.id ?? null);
        setUsers(following);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        openModal("error-modal", { message });
      });
  }, [userIdProfile, openModal]);

  const handleCancelFollowingModal = () => {
    props.onHideFollowingModal();
  };

  function handleFollowUser(userFollowId: string) {
    startTransition(() => {
      toggleFollowUser(userFollowId)
        .then(() => {
          setUsers((users) => {
            const users2 = [...users];

            const index = users2.findIndex((user) => user.id === userFollowId);
            if (index === -1) return users;

            const userFind = users2[index];

            const user2 = { ...userFind };

            user2.follow = !user2.follow;

            users2[index] = user2;

            return users2;
          });
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 px-4 backdrop-blur-lg">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_35px_120px_-60px_rgba(56,189,248,0.75)] backdrop-blur-xl">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-600">
            Your circle
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Following</h3>
        </header>

        {users.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-600">
            Not following anyone yet. Explore creators to start building your
            feed!
          </div>
        ) : (
          <div className="max-h-72 space-y-3 overflow-y-auto pr-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 transition hover:border-emerald-300/40 hover:bg-white"
              >
                <div className="flex flex-1 items-center gap-3 text-left text-sm font-semibold text-slate-900">
                  <span className="h-12 w-12 rounded-full overflow-hidden border border-emerald-300/50 shadow-[0_0_30px_-12px_rgba(52,211,153,0.8)]">
                    <ProfileImage name={user.name} image={user.image} />
                  </span>
                  <Link
                    className="font-semibold hover:text-emerald-300"
                    href={`/profile/${user.id}/posts`}
                  >
                    {user.name}
                  </Link>
                </div>
                {currentUserId === userIdProfile && (
                  <button
                    onClick={() => handleFollowUser(user.id)}
                    disabled={isPending}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-800 transition hover:border-emerald-300/40 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending
                      ? "Updating…"
                      : user?.follow
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleCancelFollowingModal}
          type="button"
          className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-800 transition hover:border-emerald-300/40 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30"
        >
          Close
        </button>
      </div>
    </div>
  );
}
