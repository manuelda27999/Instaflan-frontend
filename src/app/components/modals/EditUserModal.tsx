"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import editUser from "@/lib/api/editUser";
import { CldUploadWidget } from "next-cloudinary";
import { useModal } from "@/context/ModalContext";

interface User {
  name: string;
  image: string;
  description: string;
}

interface EditUserModalProps {
  user: User;
  onEditUser: () => void;
  onHideEditUser: () => void;
}

export default function EditUserModal(props: EditUserModalProps) {
  const user = props.user;
  const [isPending, startTransition] = useTransition();
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(
    user?.image || ""
  );

  const { openModal } = useModal();

  const handleSubmitUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const image = uploadedImageUrl.trim();
    const description = (
      form.elements.namedItem("description") as HTMLInputElement
    ).value;

    startTransition(() => {
      editUser(name, image, description)
        .then(() => {
          props.onEditUser();
        })
        .catch((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          openModal("error-modal", { message });
        });
    });
  };

  const handleCancelEditUser = () => props.onHideEditUser();

  return (
    <div className="fixed z-50 top-0 left-0 w-screen h-screen flex items-center justify-center bg-white/80 px-4 backdrop-blur-lg">
      {user && (
        <form
          onSubmit={handleSubmitUser}
          className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white px-8 py-4 shadow-sm backdrop-blur-xl"
        >
          <header className="space-y-2 text-center">
            <h3 className="text-2xl font-semibold text-slate-900">Edit profile</h3>
            <p className="text-sm text-slate-600">
              Update your display name, avatar, and bio to reflect your vibe.
            </p>
          </header>

          <div className="space-y-3">
            <label
              htmlFor="name"
              className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={user.name || ""}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-500 focus:border-emerald-300/50 focus:outline-none focus:ring-4 focus:ring-emerald-300/20"
              placeholder="Your display name"
              required
            />
          </div>

          <div className="space-y-3">
            <label
              htmlFor="image"
              className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600"
            >
              Profile Image
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
              htmlFor="description"
              className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600"
            >
              Bio
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={user.description || ""}
              className="w-full max-h-28 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-500 focus:border-emerald-300/50 focus:outline-none focus:ring-4 focus:ring-emerald-300/20"
              placeholder="Share your sweetest story…"
              required
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              onClick={handleCancelEditUser}
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
      )}
    </div>
  );
}
