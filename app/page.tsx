import { Board } from "@/features/board";

export const metadata = {
  title: "Chesu | Play",
};

export default function Home() {
  return (
    <main className="px-4 h-screen sm:px-6 lg:px-8 py-16">
      <Board />
    </main>
  );
}
