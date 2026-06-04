"use client";

import { Carousel } from "@/components/Carousel";

export default function HomeClient() {
  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <section className="mx-auto max-w-3xl px-8 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Welcome to CodeBook
        </h1>
        <p className="mt-4 text-zinc-400">
          Practice and share coding problems!
        </p>
      </section>

      <section className="bg-[#111111] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-center text-3xl text-white font-extrabold mb-16">
            How to Use CodeBook
          </h2>
          <Carousel />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-8 py-24 text-center">
        <h1 className=" font-bold tracking-tight">
          Ready to start your journey?
        </h1>
        <p className="mt-4 text-zinc-400"></p>
      </section>

      <section className="mx-auto max-w-3xl px-8 py-20 text-center ">
        <h1 className=" text-xs tracking-tight text-zinc-500">
          2026 CodeBook. All rights reserved.
        </h1>
        <h2 className=" text-xs tracking-tight text-zinc-500">
          We're legit now guys
        </h2>
        <p className="mt-4 text-zinc-400"></p>
      </section>
    </main>
  );
}
