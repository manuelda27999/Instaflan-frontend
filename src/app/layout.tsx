"use client";

import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";
import { UserInfoProvider } from "@/context/UserInfoContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-800">
        <ModalProvider>
          <UserInfoProvider>{children}</UserInfoProvider>
        </ModalProvider>
      </body>
    </html>
  );
}
