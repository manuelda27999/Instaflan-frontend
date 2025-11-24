import Header from "../components/Header";
import NavBar from "../components/NavBar";
import ModalHost from "../components/ModalHost";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col overflow-hidden">
      <Header />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col pb-21 sm:pb-20 pt-16 sm:pt-26 sm:px-6 lg:px-8">
        {children}
      </main>

      <NavBar />

      <ModalHost />
    </div>
  );
}
