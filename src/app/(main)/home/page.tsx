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
        setFirstLoading(false);
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
    <section className="sm:space-y-8 pb-9">
      {posts.length === 0 && !firstLoading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-600">
            Feed warming up
          </p>
          <h2 className="mt-4 text-2xl font-semibold leading-tight text-slate-900">
            You are not following anyone yet
          </h2>
          <p className="mt-3 text-sm text-slate-700">
            Discover new creators and start curating your sweet feed.
          </p>
          <Link
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold text-slate-900 transition hover:border-emerald-200 hover:bg-emerald-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
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
            isPending={isPending}
          />
        ))}

      <div className="fixed w-full pr-2.5 max-w-4xl bottom-24 sm:bottom-28 z-30 flex flex-col items-end">
        <button
          onClick={() =>
            openModal("create-post-modal", {
              callback: (close: () => void) => {
                loadPosts();
                close();
              },
            })
          }
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
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
