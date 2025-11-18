"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import createNewPost from "@/lib/api/createNewPost";
import { CldUploadWidget } from "next-cloudinary";
import { useModal } from "@/context/ModalContext";

interface CreatePostModalProps {
  onCreatePost: () => void;
  onHideCreatePost: () => void;
}

export default function CreatePostModal(props: CreatePostModalProps) {
  const [isPending, startTransition] = useTransition();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const { openModal } = useModal();

  const handleSubmitPost = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const text = (form.elements.namedItem("text") as HTMLTextAreaElement).value;
    const image = uploadedImageUrl.trim();

    if (!image) {
      openModal("error-modal", {
        message: "Please provide an image before publishing.",
      });
      return;
    }

    startTransition(() => {
      createNewPost(image, text)
        .then(() => {
          props.onCreatePost();
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    });
  };

  const handleCancelCreatePost = () => props.onHideCreatePost();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-lg">
      <form
        onSubmit={handleSubmitPost}
        className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_40px_120px_-60px_rgba(56,189,248,0.8)] backdrop-blur-xl"
      >
        <header className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-300">
            Share something new
          </p>
          <h3 className="text-2xl font-semibold text-white">Create a post</h3>
          <p className="text-sm text-slate-300">
            Add a caption and an image to keep your community in the loop.
          </p>
        </header>

        <div className="space-y-3">
          <label
            htmlFor="text"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300"
          >
            Caption
          </label>
          <textarea
            id="text"
            name="text"
            rows={4}
            className="w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-emerald-300/50 focus:outline-none focus:ring-4 focus:ring-emerald-300/20"
            placeholder="What do you want to share?"
            required
          />
        </div>

        <div className="space-y-3">
          <label
            htmlFor="image"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300"
          >
            Image preview & upload
          </label>

          <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-slate-900/40 p-4 text-center">
            {uploadedImageUrl ? (
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <Image
                  src={uploadedImageUrl}
                  alt="Post preview"
                  width={320}
                  height={320}
                  className="h-48 w-full object-cover"
                />
              </div>
            ) : (
              <p className="text-sm text-slate-300">
                No image selected yet. Upload one or paste a URL above.
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
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-100 transition hover:border-emerald-300/40 hover:bg-white/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30 cursor-pointer"
                  >
                    Upload from device
                  </button>
                );
              }}
            </CldUploadWidget>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={handleCancelCreatePost}
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-100 transition hover:border-emerald-300/40 hover:bg-white/15 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/30 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-teal-300 to-sky-300 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-lg transition hover:shadow-xl hover:brightness-110 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Creating…" : "Create post"}
          </button>
        </div>
      </form>
    </div>
  );
}
