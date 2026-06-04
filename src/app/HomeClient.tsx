"use client";

import { Carousel } from "@/components/Carousel";
import PixelBlast from "@/components/PixelBlast";
import Link from "next/link";
import { JSX } from "react";

export default function HomeClient(): JSX.Element {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <PixelBlast
          variant="diamond"
          pixelSize={5}
          color="#6d5c87"
          patternScale={4.25}
          patternDensity={2}
          pixelSizeJitter={2}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={3}
          edgeFade={0.41}
          transparent
        />
      </div>

      <main className="min-h-screen text-white">
        <section className="mx-auto max-w-3xl px-8 py-24 text-center">
          <h1 className="text-8xl font-bold tracking-tight">
            Welcome to CodeBook
          </h1>
          <p className="mt-4 text-white text-xl">
            Practice and share coding problems!
          </p>
        </section>

        <section className=" py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-center text-3xl text-white font-extrabold mb-16">
              How to Use CodeBook
            </h2>
            <Carousel />
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-8 py-24 text-center">
          <h1 className=" font-bold tracking-tight">Ready to Begin?</h1>
          <p className="mt-4 text-zinc-400"></p>
          <Link href="/login" className="logo">
            <button className="bg-white text-black px-10 py-4 rounded-lg hover:bg-gray-300 transition-all inline-flex items-center gap-2">
              <span>Create Free Account</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-move-right-icon lucide-move-right"
              >
                <path d="M18 8L22 12L18 16" />
                <path d="M2 12H22" />
              </svg>
            </button>
          </Link>
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
    </div>
  );
}
