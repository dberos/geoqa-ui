import { headers } from "next/headers";
import Hero from "./_components/hero";
import Personas from "./_components/personas";
import Services from "./_components/services";

export default async function Home() {
  await headers();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between z-0">
      <Hero />
      <Personas />
      <Services />
    </main>
  );
}
