"use client";

import { useState, useEffect } from "react";

// this is where I've been taking icons from :D ->  https://lucide.dev/icons/

function Svg({ children, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

// picture icons in theee squares

const CheckCircle = (props) => (
  <Svg {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </Svg>
);

const BookOpen = (props) => (
  <Svg {...props}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </Svg>
);

const Code2 = (props) => (
  <Svg {...props}>
    <path d="m18 16 4-4-4-4" />
    <path d="m6 8-4 4 4 4" />
    <path d="m14.5 4-5 16" />
  </Svg>
);

const Play = (props) => (
  <Svg {...props}>
    <polygon points="6 3 20 12 6 21 6 3" />
  </Svg>
);

const Trophy = (props) => (
  <Svg {...props}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </Svg>
);

//these are the left and right arrows
const ChevronLeft = (props) => (
  <Svg {...props}>
    <path d="m15 18-6-6 6-6" />
  </Svg>
);

const ChevronRight = (props) => (
  <Svg {...props}>
    <path d="m9 18 6-6-6-6" />
  </Svg>
);

// cards!

const steps = [
  {
    number: 1,
    title: "Create your Account",
    description:
      "Sign up for free to access all features. Track your solved problems, publish your own challenges, and join the community.",
    icon: CheckCircle,
  },
  {
    number: 2,
    title: "Explore Problems",
    description:
      "Browse a collection of coding challenges created by the codebook community.",
    icon: BookOpen,
  },
  {
    number: 3,
    title: "Write Your Solution",
    description:
      "Code your solution in our built-in editor. Choose from multiple languages including C++, Python, Java, and JavaScript. Use the examples and constraints to guide your implementation.",
    icon: Code2,
  },
  {
    number: 4,
    title: "Submit & Get Feedback",
    description:
      "Click Submit to run your code against test cases. Get instant feedback on whether your solution is correct, with detailed error messages if something goes wrong.",
    icon: Play,
  },
  {
    number: 5,
    title: "Track Progress & Create",
    description:
      "View your solved problems on your profile page. Ready to contribute? Create your own coding challenges and share them with the community!",
    icon: Trophy,
  },
];

//--------------------------------------------------

export function Carousel() {
  const count = steps.length;
  // Cloned list: [lastClone, ...real, firstClone]. Real slides live at index 1..count.
  const slides = [steps[count - 1], ...steps, steps[0]];

  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(false);

  //pause the autoplay so it doesn't disappear
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Autoplay — resets the 4s timer
  useEffect(() => {
    if (paused || hidden) return;
    const id = setTimeout(() => setIndex((i) => i + 1), 4000);
    return () => clearTimeout(id);
  }, [index, paused, hidden]);

  // Re-enable the transition after a snap-back jump (double rAF so the jump paints first).
  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setAnimate(true)),
    );
    return () => cancelAnimationFrame(id);
  }, [animate]);

  const handleTransitionEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    if (index >= count + 1) {
      setAnimate(false);
      setIndex(1);
    } else if (index <= 0) {
      setAnimate(false);
      setIndex(count);
    }
  };

  const activeDot =
    index === 0 ? count - 1 : index === count + 1 ? 0 : index - 1;

  return (
    <div className="max-w-4xl mx-auto">
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: animate ? "transform 500ms ease-in-out" : "none",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {slides.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="min-w-full px-4">
                <div className="bg-[#111111] border-2 border-white rounded-lg p-12 min-h-125 flex flex-col items-center text-center">
                  <div className="bg-white text-black w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <span className="text-2xl font-bold">{step.number}</span>
                  </div>
                  <div className="bg-[#111111] border-2 border-white rounded-lg p-4 mb-6">
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="mb-4 text-white">{step.title}</h3>
                  <p className="text-gray-400 max-w-2xl">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setIndex((i) => i - 1)}
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-black rounded-full p-2 shadow transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => setIndex((i) => i + 1)}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-black rounded-full p-2 shadow transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {steps.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i + 1)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === activeDot
                ? "w-6 bg-white"
                : "w-2 bg-gray-600 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
