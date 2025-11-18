"use client";

import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-300/20 selection:text-emerald-100">
        <ModalProvider>{children}</ModalProvider>
      </body>
    </html>
  );
}
