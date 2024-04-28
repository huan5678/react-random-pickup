import backgroundImg from "@/assets/images/bg.jpg";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <main className="relative min-h-screen to-black/90 from-black/90 via-black/10 bg-gradient-to-b">
      <img
        src={backgroundImg}
        className="absolute z-[-1] object-cover w-full h-screen"
        alt="background"
      />
      {children}
      <Toaster />
    </main>
  );
}
