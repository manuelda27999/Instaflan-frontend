"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import retrievePosts from "@/lib/api/retrievePosts";
import Link from "next/link";
import Post from "@/app/components/Post";
import toggleFavPost from "@/lib/api/toggleFavPost";
import { useModal } from "@/context/ModalContext";
import LoadingModal from "@/app/components/modals/LoadingModal";

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

export default function AllPosts() {
  const { openModal } = useModal();

  const [posts, setPosts] = useState<Post[]>([]);
  const [firstLoading, setFirstLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadPosts = useCallback(() => {
    setFirstLoading(true);

    retrievePosts()
      .then((posts) => {
        setPosts(posts);
        console.log(posts);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        openModal("error-modal", { message });
      });
  }, [openModal]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  function handleToggleFavPost(postId: string) {
    startTransition(() => {
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
    <section className="space-y-8 pb-14">
      {posts.length === 0 && !firstLoading && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-[0_40px_120px_-70px_rgba(56,189,248,0.7)] backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-300">
            Feed warming up
          </p>
          <h2 className="mt-4 text-2xl font-semibold leading-tight text-white">
            You are not following anyone yet
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Discover new creators and start curating your sweet feed.
          </p>
          <Link
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-2 text-sm font-semibold text-slate-100 transition hover:border-emerald-300/50 hover:bg-white/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30"
            href="/explorer"
          >
            Browse explorer
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
          </Link>
        </div>
      )}

      {posts.length > 0 &&
        posts.map((post, index) => (
          <Post
            key={post.id}
            post={post}
            updatePosts={loadPosts}
            handleToggleFavPostProps={handleToggleFavPost}
            index={index}
          />
        ))}

      <div className="fixed w-11/12 max-w-4xl bottom-28 z-30 flex flex-col items-end">
        <button
          onClick={() =>
            openModal("create-post-modal", {
              callback: (close: () => void) => {
                loadPosts();
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

      {firstLoading && posts.length === 0 && <LoadingModal />}
    </section>
  );
}
