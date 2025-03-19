import { headers } from "next/headers";

export default async function Home() {
  await headers();
  return (
    <main className="h-[130vh] w-full flex items-center justify-center">
      <h1 className="text-2xl">
        Hello World!
      </h1>
    </main>
  );
}
