import confetti from "canvas-confetti";

export default function SolveCelebration() {
  // left
  confetti({
    particleCount: 50,
    spread: 100,
    angle: 65,
    startVelocity: 60,
    origin: { y: 1, x: 0 }
  });

  // right
  confetti({
    particleCount: 50,
    spread: 100,
    angle: 115,
    startVelocity: 60,
    origin: { y: 1, x: 1 }
  });
}
