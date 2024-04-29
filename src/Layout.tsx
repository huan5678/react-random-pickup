import { Toaster } from "@/components/ui/toaster";
import useStore from "@/store";
import Confetti from "@/components/Confetti";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  const background = useStore((state) => state.config.background);
  const showConfetti = useStore((state) => state.config.showConfetti);
  return (
    <>
      <main className="relative min-h-screen to-black/90 from-black/90 via-black/10 bg-gradient-to-b">
        <img
          src={background}
          className="absolute z-[-1] object-cover w-full max-h-screen rotate-180"
          alt="background"
        />
        {children}
        <Toaster />
      </main>
      {showConfetti && <Confetti />}
    </>
  );
}
