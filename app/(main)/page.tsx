import { headers } from "next/headers";
import Hero from "./_components/hero";
import Personas from "./_components/personas";

export default async function Home() {
  await headers();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <Personas />
    </main>
  );
}
