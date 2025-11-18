"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";
import retrievePostsOfUser from "@/lib/api/retrievePostsOfUser";
import toggleFavPost from "@/lib/api/toggleFavPost";
import { useModal } from "@/context/ModalContext";

import Post from "@/app/components/Post";

interface Post {
  id: string;
  text: string;
  likes: number;
  image: string;
  fav: boolean;
  author: { id: string; name: string; image: string };
  comments: {
    id: string;
    text: string;
    author: { id: string; name: string; image: string };
  }[];
}

export default function ProfilePosts() {
  const pathname = usePathname();
  const userIdProfile = pathname.split("/")[2];

  const [posts, setPosts] = useState<Post[]>([]);
  const [isPending, startTransition] = useTransition();
  const { openModal } = useModal();

  useEffect(() => {
    retrievePostsOfUser(userIdProfile)
      .then((posts) => {
        setPosts(posts);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        openModal("error-modal", { message });
      });
  }, [userIdProfile, openModal]);

  const updatePosts = () => {
    retrievePostsOfUser(userIdProfile)
      .then((posts) => {
        setPosts(posts);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        openModal("error-modal", { message });
      });
  };

  function handletoggleFavPost(postId: string) {
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
    <section className="space-y-8 pb-6">
      {posts.length === 0 && !isPending && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-[0_35px_120px_-70px_rgba(56,189,248,0.75)] backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-300">
            Nothing shared yet
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-white">
            No posts available
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            When this profile publishes a new post, it will appear right here.
          </p>
        </div>
      )}

      {posts.map((post, index) => (
        <Post
          key={post.id}
          post={post}
          updatePosts={updatePosts}
          handleToggleFavPostProps={handletoggleFavPost}
          index={index}
        />
      ))}

      {isPending && posts.length === 0 && (
        <p className="mt-4 text-center text-sm text-slate-400">
          Loading posts…
        </p>
      )}
    </section>
  );
}
