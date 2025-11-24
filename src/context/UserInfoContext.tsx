"use client";

import retrieveUser from "@/lib/api/retrieveUser";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
} from "react";

import { useModal } from "./ModalContext";
import retrieveNotifications from "@/lib/api/retrieveNotifications";
import retrieveChats from "@/lib/api/retrieveChats";

interface User {
  id: string;
  name: string;
  image: string;
}

interface Chat {
  id: string;
  participants: string[];
  unreadFor: string[];
}

interface Notification {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
  post?: {
    image: string;
  };
}

interface UserInfo {
  id: string;
  name: string;
  avatarUrl: string;
  messageCount: number;
  notificationsCount: number;
}

interface UserInfoContextType {
  userInfo: UserInfo | null;
  updateUserInfo: () => void;
}

const UserInfoContext = createContext<UserInfoContextType | null>(null);

export const UserInfoProvider = ({ children }: { children: ReactNode }) => {
  const { openModal } = useModal();
  const [userInfo, setUserInfo] = useState<UserInfo | null>({
    id: "",
    name: "",
    avatarUrl: "",
    messageCount: 0,
    notificationsCount: 0,
  });

  const updateUserInfo = useCallback(() => {
    Promise.all([retrieveUser(), retrieveChats(), retrieveNotifications()])
      .then(([user, chats, notifications]: [User, Chat[], Notification[]]) => {
        setUserInfo({
          id: user.id,
          name: user.name,
          avatarUrl: user.image,
          messageCount: chats.reduce((total: number, chat: Chat) => {
            if (!user.id) return total;
            return chat.unreadFor.includes(user.id) ? total + 1 : total;
          }, 0),
          notificationsCount: notifications.length,
        });
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        openModal("error-modal", { message });
      });
  }, [openModal]);

  return (
    <UserInfoContext.Provider value={{ userInfo, updateUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserInfoContext);
  if (context === null) {
    throw new Error("useUserInfo must be used within a UserInfoProvider");
  }
  return context;
};
