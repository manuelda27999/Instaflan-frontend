"use client";

import { useModal } from "@/context/ModalContext";
import CreatePostModal from "./modals/CreatePostModal";
import CreateCommentModal from "./modals/CreateCommentModal";
import DeletePostModal from "./modals/DeletePostModal";
import EditPostModal from "./modals/EditPostModal";
import EditDeleteMessageModal from "./modals/EditDeleteMessageModal";
import ErrorModal from "./modals/ErrorModal";

interface Post {
  id: string;
  image: string;
  text: string;
}

export default function ModalHost() {
  const { modalState, closeModal } = useModal();

  if (!modalState) return null;

  switch (modalState.name) {
    case "create-comment-modal":
      return (
        <CreateCommentModal
          postId={modalState.props.postId}
          onCreateComment={() => {
            modalState.props.callback?.(closeModal);
          }}
          onHideCreateComment={() => closeModal()}
        />
      );
    case "create-post-modal":
      return (
        <CreatePostModal
          onCreatePost={() => {
            modalState.props.callback?.(closeModal);
          }}
          onHideCreatePost={() => closeModal()}
        />
      );
    case "delete-post-modal":
      return (
        <DeletePostModal
          postId={modalState.props.postId}
          onDeletePost={() => {
            modalState.props.callback?.(closeModal);
          }}
          onHideDeletePost={() => closeModal()}
        />
      );
    case "edit-post-modal":
      return (
        <EditPostModal
          postId={modalState.props.postId}
          onEditPost={(post: Post) => {
            modalState.props.callback?.(closeModal, post);
          }}
          onHideEditPost={() => closeModal()}
        />
      );
    case "edit-delete-message":
      return (
        <EditDeleteMessageModal
          message={modalState.props.message}
          onHideEditDeletePost={() => closeModal()}
        />
      );
    case "error-modal":
      return (
        <ErrorModal
          message={modalState.props.message}
          onClose={() => {
            modalState.props.callback?.(closeModal);
            closeModal();
          }}
        />
      );
    default:
      return null;
  }
}
