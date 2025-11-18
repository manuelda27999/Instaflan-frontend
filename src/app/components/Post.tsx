"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import retrieveUser from "@/lib/api/retrieveUser";

import { useModal } from "@/context/ModalContext";
import ProfileImage from "./ProfileImage";

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

interface PostProps {
  post: Post;
  updatePosts: () => void;
  handleToggleFavPostProps: (postId: string) => void;
  index?: number;
}

export default function Post(props: PostProps) {
  const [post, setPost] = useState<Post>(props.post);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { openModal } = useModal();

  useEffect(() => {
    setPost(props.post);
  }, [props.post]);

  useEffect(() => {
    let active = true;

    retrieveUser()
      .then((user) => {
        if (!active) return;
        setCurrentUserId(user?.id ?? null);
      })
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });

    return () => {
      active = false;
    };
  }, [openModal]);

  function updateThisPost(updated: {
    id: string;
    image: string;
    text: string;
  }) {
    setPost((prev) => {
      if (!prev || prev.id !== updated.id) return prev;

      return {
        ...prev,
        image: updated.image,
        text: updated.text,
      };
    });
  }

  return (
    <article className="relative mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_40px_120px_-70px_rgba(56,189,248,0.8)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-32 rounded-full bg-emerald-300/10 blur-3xl" />
      <div className="relative z-10">
        <header className="flex items-center justify-between px-6 pt-6">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href={`/profile/${post.author.id}/posts`}
              className="h-12 w-12 rounded-full overflow-hidden border border-emerald-300/50 shadow-[0_0_30px_-12px_rgba(52,211,153,0.8)]"
            >
              <ProfileImage name={post.author.name} image={post.author.image} />
            </Link>
            <div className="min-w-0">
              <Link
                href={`/profile/${post.author.id}/posts`}
                className="text-lg font-bold text-white transition hover:text-emerald-200 truncate"
              >
                {post.author.name}
              </Link>
            </div>
          </div>

          <button
            onClick={() => props.handleToggleFavPostProps(post.id)}
            className={`group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition ${
              post.fav
                ? "border-emerald-300/60 bg-emerald-400/15 text-emerald-100 shadow-[0_0_30px_-12px_rgba(52,211,153,0.8)]"
                : "border-white/15 bg-white/10 text-slate-300 hover:border-emerald-300/45 hover:bg-emerald-400/10 hover:text-emerald-100"
            }`}
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                post.fav
                  ? "bg-gradient-to-br from-emerald-300/60 via-teal-300/60 to-sky-300/60 text-slate-900"
                  : "bg-white/10 text-slate-100"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill={post.fav ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 20.25l-7.05-7.05a4.5 4.5 0 010-6.36 4.5 4.5 0 016.36 0L12 7.53l.69-.69a4.5 4.5 0 016.36 6.36L12 20.25z" />
              </svg>
            </span>
            <span className="hidden group-hover:tracking-[0.35em] sm:inline">
              {post.fav ? "Liked" : "Like"}
            </span>
          </button>
        </header>

        <div className="mt-5 px-6">
          <Image
            priority={
              typeof props.index === "number" && props.index < 3 ? true : false
            }
            width={800}
            height={600}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/40 object-cover"
            src={post.image || "/images/image-not-available.webp"}
            alt={post.text || `${post.author.name}'s post`}
            onError={(event) => {
              const target = event.target as HTMLImageElement;
              target.src = "/images/image-not-available.webp";
            }}
          />
        </div>

        <div className="space-y-4 px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-200">
              <span className="text-emerald-200">{post.likes}</span> favorites
            </p>
            <button
              onClick={() =>
                openModal("create-comment-modal", {
                  postId: post.id,
                  callback: (close: () => void) => {
                    props.updatePosts();
                    close();
                  },
                })
              }
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300 px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:shadow-xl hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/40"
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
                <path d="M4 5.5h16a1.5 1.5 0 011.5 1.5v8a1.5 1.5 0 01-1.5 1.5H9.8L6 20l.9-3.5H4A1.5 1.5 0 012.5 15V7a1.5 1.5 0 011.5-1.5z" />
              </svg>
              Comment
            </button>
          </div>

          {post.text && (
            <p className="text-sm leading-relaxed text-slate-200">
              {post.text}
            </p>
          )}

          {post.comments.length > 0 && (
            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-300">
                Comments
              </p>
              {post.comments.map((comment) => (
                <article className="flex items-center gap-3" key={comment.id}>
                  <Link
                    href={`/profile/${comment.author.id}/posts`}
                    className="h-8 w-8 rounded-full overflow-hidden border border-emerald-300/50 shadow-[0_0_30px_-12px_rgba(52,211,153,0.8)]"
                  >
                    <ProfileImage
                      name={comment.author.name}
                      image={comment.author.image}
                    />
                  </Link>
                  <div className="flex-1">
                    <Link
                      className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-200 transition hover:text-emerald-100"
                      href={`/profile/${comment.author.id}/posts`}
                    >
                      {comment.author.name}
                    </Link>
                    <p className="mt-1 text-xs text-slate-200">
                      {comment.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {currentUserId === post.author.id && (
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() =>
                  openModal("edit-post-modal", {
                    postId: post.id,
                    callback: (
                      close: () => void,
                      updatedPost: { id: string; text: string; image: string }
                    ) => {
                      updateThisPost(updatedPost);
                      close();
                    },
                  })
                }
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-100 transition hover:border-emerald-300/40 hover:bg-white/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30"
              >
                Edit
              </button>
              <button
                onClick={() =>
                  openModal("delete-post-modal", {
                    postId: post.id,
                    callback: (close: () => void) => {
                      props.updatePosts();
                      close();
                    },
                  })
                }
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-rose-200 transition hover:border-rose-300/50 hover:bg-rose-400/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-300/30"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
