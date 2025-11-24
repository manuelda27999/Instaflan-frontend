import { useEffect, useState } from "react";
import retrieveFollowed from "@/lib/api/retrieveFollowed";
import { usePathname } from "next/navigation";
import ProfileImage from "../ProfileImage";
import { useModal } from "@/context/ModalContext";
import Link from "next/link";

interface FollowedModalProps {
  onHideFollowedModal: () => void;
}

interface User {
  id: string;
  name: string;
  image: string;
  follow: boolean;
}

export default function FollowedModal(props: FollowedModalProps) {
  const [users, setUsers] = useState<User[]>([]);
  const { openModal } = useModal();

  const pathname = usePathname();
  const userIdProfile = pathname.split("/")[2];

  useEffect(() => {
    retrieveFollowed(userIdProfile)
      .then((users) => setUsers(users))
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        openModal("error-modal", { message });
      });
  }, [userIdProfile, openModal]);

  const handleCancelFollowedModal = () => {
    props.onHideFollowedModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 px-4 backdrop-blur-lg">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_35px_120px_-60px_rgba(56,189,248,0.75)] backdrop-blur-xl">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-600">
            Community
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">Followers</h3>
        </header>

        {users.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-600">
            No followers yet. Share more flan-tastic updates to grow your crew!
          </div>
        ) : (
          <div className="max-h-72 space-y-3 overflow-y-auto pr-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-left text-sm font-semibold text-slate-900 transition hover:border-emerald-300/40 hover:bg-white"
              >
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
            ))}
          </div>
        )}

        <button
          onClick={handleCancelFollowedModal}
          type="button"
          className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-800 transition hover:border-emerald-300/40 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30"
        >
          Close
        </button>
      </div>
    </div>
  );
}
