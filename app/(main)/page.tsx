import { headers } from "next/headers";
import Hero from "./_components/hero";

export default async function Home() {
  await headers();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-2xl">
          Hello World!
        </h1>
      </div>
    </main>
  );
}
