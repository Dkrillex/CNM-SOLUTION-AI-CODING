import { Footer } from "@/components/footer";
import { Capabilities, Cta, Systems, UseCases } from "@/components/home/rest";
import { Hero } from "@/components/home/hero";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Systems />
      <Capabilities />
      <UseCases />
      <Cta />
      <Footer />
    </div>
  );
}
