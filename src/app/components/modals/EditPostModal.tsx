"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import retrievePost from "@/lib/api/retrievePost";
import editPost from "@/lib/api/editPost";
import { useModal } from "@/context/ModalContext";

interface EditPostModalProps {
  postId: string;
  onEditPost: (post: Post) => void;
  onHideEditPost: () => void;
}

interface Post {
  id: string;
  image: string;
  text: string;
}

export default function EditPostModal(props: EditPostModalProps) {
  const [post, setPost] = useState<Post | null>(null);

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(
    post?.image || ""
  );

  const { openModal } = useModal();

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    retrievePost(props.postId)
      .then((post) => {
        setPost(post);
        setUploadedImageUrl(post.image);
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        openModal("error-modal", { message });
      });
  }, [props.postId, openModal]);

  const handleSubmitPost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const image = uploadedImageUrl.trim();
    const text = (form.elements.namedItem("text") as HTMLInputElement).value;

    startTransition(() => {
      editPost(props.postId, image, text)
        .then(() => {
          props.onEditPost({ id: props.postId, image, text });
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    });
  };

  const handleCancelEditPost = () => props.onHideEditPost();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 px-4 backdrop-blur-lg">
      {post ? (
        <form
          onSubmit={handleSubmitPost}
          className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm backdrop-blur-xl"
        >
          <header className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-slate-600">
              Refresh your post
            </p>
            <h3 className="text-2xl font-semibold text-slate-900">
              Edit this share
            </h3>
            <p className="text-sm text-slate-600">
              Update the image or caption to keep your feed on point.
            </p>
          </header>

          <div className="space-y-3">
            <label
              htmlFor="image"
              className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600"
            >
              Image
            </label>
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
              {uploadedImageUrl ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black/20">
                  <Image
                    src={uploadedImageUrl}
                    alt="Post preview"
                    width={320}
                    height={320}
                    className="h-48 w-full object-cover"
                  />
                </div>
              ) : (
                <p className="text-sm text-slate-600">
                  No image selected yet. Upload one.
                </p>
              )}

              <CldUploadWidget
                signatureEndpoint="/api/sign-cloudinary-params"
                onSuccess={(result) => {
                  if (
                    typeof result.info !== "string" &&
                    result?.info?.secure_url
                  ) {
                    setUploadedImageUrl(result?.info.secure_url);
                  } else {
                    console.error("Upload failed: No secure_url found.");
                  }
                }}
                onQueuesEnd={(result, { widget }) => {
                  widget.close();
                }}
              >
                {({ open }) => {
                  function handleOnClick(
                    event: React.MouseEvent<HTMLButtonElement>
                  ) {
                    event.preventDefault();
                    open();
                  }
                  return (
                    <button
                      onClick={handleOnClick}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-800 transition hover:border-emerald-300/40 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30 cursor-pointer"
                    >
                      Upload from device
                    </button>
                  );
                }}
              </CldUploadWidget>
            </div>
          </div>

          <div className="space-y-3">
            <label
              htmlFor="text"
              className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600"
            >
              Caption
            </label>
            <textarea
              id="text"
              name="text"
              rows={4}
              defaultValue={post.text || ""}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-500 focus:border-emerald-300/50 focus:outline-none focus:ring-4 focus:ring-emerald-300/20"
              placeholder="Update your message…"
              required
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={handleCancelEditPost}
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-800 transition hover:border-emerald-300/40 hover:bg-white focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex w-full max-w-sm items-center justify-center rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm backdrop-blur-xl">
          Loading post…
        </div>
      )}
    </div>
  );
}
