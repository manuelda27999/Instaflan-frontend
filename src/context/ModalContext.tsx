"use client";

import { createContext, useState, useContext, ReactNode, useCallback } from "react";

type CloseModalFn = () => void;

type PostSummary = {
  id: string;
  image: string;
  text: string;
};

type MessageSummary = {
  author: string;
  delete?: boolean;
  edit?: boolean;
  id: string;
  text: string;
};

type UserSummary = {
  name: string;
  image: string;
  description: string;
};

type CreatePostModalProps = {
  callback?: (close: CloseModalFn) => void;
};

type CreateCommentModalProps = {
  postId: string;
  callback?: (close: CloseModalFn) => void;
};

type DeletePostModalProps = {
  postId: string;
  callback?: (close: CloseModalFn) => void;
};

type EditPostModalProps = {
  postId: string;
  callback?: (close: CloseModalFn, post: PostSummary) => void;
};

type EditUserModalProps = {
  user: UserSummary;
  callback?: (close: CloseModalFn) => void;
};

type EditDeleteMessageModalProps = {
  message: MessageSummary;
  callback?: (close: CloseModalFn) => void;
};

type ErrorModalProps = {
  message: string;
  callback?: (close: CloseModalFn) => void;
};

type ModalState =
  | { name: "create-post-modal"; props: CreatePostModalProps }
  | { name: "create-comment-modal"; props: CreateCommentModalProps }
  | { name: "delete-post-modal"; props: DeletePostModalProps }
  | { name: "edit-post-modal"; props: EditPostModalProps }
  | { name: "edit-user-modal"; props: EditUserModalProps }
  | { name: "edit-delete-message"; props: EditDeleteMessageModalProps }
  | { name: "following-modal"; props?: unknown }
  | { name: "followed-modal"; props?: unknown }
  | { name: "error-modal"; props: ErrorModalProps };

type ModalName = ModalState["name"];
type ModalPropsUnion = ModalState extends { props: infer P } ? P : null;

type OpenModal = {
  (name: "create-post-modal", props: CreatePostModalProps): void;
  (name: "create-comment-modal", props: CreateCommentModalProps): void;
  (name: "delete-post-modal", props: DeletePostModalProps): void;
  (name: "edit-post-modal", props: EditPostModalProps): void;
  (name: "edit-user-modal", props: EditUserModalProps): void;
  (name: "edit-delete-message", props: EditDeleteMessageModalProps): void;
  (name: "following-modal"): void;
  (name: "followed-modal"): void;
  (name: "error-modal", props: ErrorModalProps): void;
};

interface ModalContextType {
  modal: ModalName | null;
  modalProps: ModalPropsUnion;
  modalState: ModalState | null;
  openModal: OpenModal;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalState, setModalState] = useState<ModalState | null>(null);

  const openModal: OpenModal = useCallback(
    (name: ModalName, props?: unknown) => {
      switch (name) {
        case "create-post-modal":
          setModalState({
            name,
            props: (props ?? {}) as CreatePostModalProps,
          });
          break;
        case "create-comment-modal":
          setModalState({
            name,
            props: props as CreateCommentModalProps,
          });
          break;
        case "delete-post-modal":
          setModalState({
            name,
            props: props as DeletePostModalProps,
          });
          break;
        case "edit-post-modal":
          setModalState({
            name,
            props: props as EditPostModalProps,
          });
          break;
        case "edit-user-modal":
          setModalState({
            name,
            props: props as EditUserModalProps,
          });
          break;
        case "edit-delete-message":
          setModalState({
            name,
            props: props as EditDeleteMessageModalProps,
          });
          break;
        case "following-modal":
          setModalState({ name });
          break;
        case "followed-modal":
          setModalState({ name });
          break;
        case "error-modal":
          setModalState({
            name,
            props: props as ErrorModalProps,
          });
          break;
        default:
          break;
      }
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalState(null);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        modal: modalState?.name ?? null,
        modalProps: modalState?.props as ModalPropsUnion,
        modalState,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("useModal should be used within a ModalProvider");
  }

  return context;
};
