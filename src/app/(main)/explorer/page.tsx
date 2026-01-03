"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";

import retrieveUsersNotFollowed from "@/lib/api/retrieveUsersNotFollowed";
import retrievePostsNotFollowed from "@/lib/api/retrievePostsNotFollowed";
import toggleFollowUser from "@/lib/api/toggleFollowUser";
import toggleFavPost from "@/lib/api/toggleFavPost";
import Post from "@/app/components/Post";
import ProfileImage from "@/app/components/ProfileImage";
import { useModal } from "@/context/ModalContext";
import LoadingModal from "@/app/components/modals/LoadingModal";

interface User {
  id: string;
  name: string;
  image: string;
}

interface Post {
  id: string;
  fav: boolean;
  likes: number;
  text: string;
  image: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  comments: Array<{
    id: string;
    text: string;
    author: {
      id: string;
      name: string;
      image: string;
    };
  }>;
}

export default function Explorer() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [firstLoading, setFirstLoading] = useState<boolean>(false);
  const [userFolled, setUserFolled] = useState<string>("");

  const [isPending, startTransition] = useTransition();
  const [isUpdatingUsers, startUsersTransition] = useTransition();
  const [isUpdatingPosts, startPostsTransition] = useTransition();
  const { openModal } = useModal();

  useEffect(() => {
    setFirstLoading(true);
    Promise.all([retrieveUsersNotFollowed(), retrievePostsNotFollowed()])
      .then(([users, posts]) => {
        setUsers(users);
        setPosts(posts);
        setFirstLoading(false);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        openModal("error-modal", { message });
      });
  }, [openModal]);

  function handleFollowUser(userIdProfile: string) {
    setUserFolled(userIdProfile);
    startTransition(() => {
      toggleFollowUser(userIdProfile)
        .then(() => {
          setUsers((users) =>
            users.filter((user) => user.id !== userIdProfile)
          );
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    });
  }

  function handleUpdateUsers() {
    startUsersTransition(() => {
      retrieveUsersNotFollowed()
        .then((users) => {
          setUsers(users);
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    });
  }

  function handleUpdatePosts() {
    startPostsTransition(() => {
      retrievePostsNotFollowed()
        .then((posts) => {
          setPosts(posts);
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    });
  }

  function handletoggleFavPost(postId: string) {
    startPostsTransition(() => {
      toggleFavPost(postId)
        .then(() => {
          setPosts((posts) => {
            const posts2 = [...posts];

            const index = posts2.findIndex((post) => post.id === postId);
            if (index === -1) return posts;

            const post = posts2[index];

            const post2 = { ...post };

            if (post2.fav) {
              post2.likes--;
            } else {
              post2.likes++;
            }

            post2.fav = !post2.fav;

            posts2[index] = post2;

            return posts2;
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
    <>
      {firstLoading && users.length === 0 && posts.length === 0 && (
        <LoadingModal />
      )}
      <section className="space-y-12">
        <article className="space-y-6 sm:rounded-3xl border-y-2 sm:border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-xl sm:p-8">
          <header className="flex flex-wrap items-center justify-between gap-3 ">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-600">
                Fresh connections
              </p>
              <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                Creators you may know
              </h2>
            </div>
            <button
              onClick={handleUpdateUsers}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-800 transition hover:border-emerald-300/40 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30"
            >
              {isUpdatingUsers ? "Updating…" : "Refresh"}
            </button>
          </header>

          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 transition hover:border-emerald-300/40 hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <Link
                      href={`profile/${user.id}/posts`}
                      className="h-16 w-16 rounded-full overflow-hidden border border-emerald-300/50"
                    >
                      <ProfileImage name={user.name} image={user.image} />
                    </Link>
                    <div>
                      <Link
                        href={`profile/${user.id}/posts`}
                        className="text-lg font-semibold text-slate-900 transition hover:text-emerald-600"
                      >
                        {user.name}
                      </Link>
                      <p className="text-xs text-slate-500">
                        Tap to view their latest posts
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleFollowUser(user.id)}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900 shadow-lg transition hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending && user.id === userFolled
                      ? "Following…"
                      : "Follow"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
              <p className="text-sm text-slate-600">
                You are already following every suggested creator. Check back
                later for more!
              </p>
            </div>
          )}
        </article>

        <article className="sm:rounded-2xl border border-slate-200 bg-white shadow-sm sm:p-6">
          <header className="flex flex-wrap items-center justify-between gap-3 py-6 px-3">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-600">
                Curated for you
              </p>
              <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
                Posts beyond your circle
              </h2>
            </div>
            <button
              onClick={handleUpdatePosts}
              disabled={isUpdatingPosts}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-800 transition hover:border-emerald-200 hover:bg-emerald-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isUpdatingPosts ? "Updating…" : "Refresh"}
            </button>
          </header>

          <div className="sm:space-y-8">
            {posts.map((post, index) => (
              <Post
                key={post.id}
                post={post}
                updatePosts={handleUpdatePosts}
                handleToggleFavPostProps={handletoggleFavPost}
                index={index}
                isPending={isPending}
              />
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
