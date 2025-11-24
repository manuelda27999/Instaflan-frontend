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
  isPending: boolean;
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
    <article className="relative overflow-hidden sm:rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative z-10">
        <header className="flex items-center justify-between px-6 pt-6">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href={`/profile/${post.author.id}/posts`}
              className="h-12 w-12 rounded-full overflow-hidden border border-emerald-300/40 shadow-[0_0_24px_-14px_rgba(249,115,22,0.4)]"
            >
              <ProfileImage name={post.author.name} image={post.author.image} />
            </Link>
            <div className="min-w-0">
              <Link
                href={`/profile/${post.author.id}/posts`}
                className="text-lg font-bold text-slate-900 transition hover:text-emerald-600 truncate"
              >
                {post.author.name}
              </Link>
            </div>
          </div>
          {props.isPending ? (
            <p className="loader-small"></p>
          ) : (
            <button
              disabled={props.isPending}
              onClick={() => props.handleToggleFavPostProps(post.id)}
              className={`group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition ${
                post.fav
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm"
                  : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  post.fav
                    ? "bg-gradient-to-br from-emerald-300 via-teal-300 to-sky-300 text-slate-900"
                    : "bg-slate-100 text-slate-700"
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
          )}
        </header>

        <div className="mt-5 px-6">
          <Image
            priority={
              typeof props.index === "number" && props.index < 3 ? true : false
            }
            width={800}
            height={600}
            className="w-full rounded-2xl border border-slate-200 bg-slate-100 object-cover"
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
            <p className="text-sm font-semibold text-slate-700">
              <span className="text-emerald-600">{post.likes}</span> favorites
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
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
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
            <p className="text-sm leading-relaxed text-slate-700">
              {post.text}
            </p>
          )}

          {post.comments.length > 0 && (
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">
                Comments
              </p>
              {post.comments.map((comment) => (
                <article className="flex items-center gap-3" key={comment.id}>
                  <Link
                    href={`/profile/${comment.author.id}/posts`}
                    className="h-8 w-8 rounded-full overflow-hidden border border-emerald-300/50 shadow-[0_0_24px_-14px_rgba(249,115,22,0.35)]"
                  >
                    <ProfileImage
                      name={comment.author.name}
                      image={comment.author.image}
                    />
                  </Link>
                  <div className="flex-1">
                    <Link
                      className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700 transition hover:text-emerald-600"
                      href={`/profile/${comment.author.id}/posts`}
                    >
                      {comment.author.name}
                    </Link>
                    <p className="mt-1 text-xs text-slate-700">
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
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-800 transition hover:border-emerald-200 hover:bg-emerald-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
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
                className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-rose-600 transition hover:bg-rose-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
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
