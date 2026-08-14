import { createHash, timingSafeEqual } from "node:crypto";

// SHA256 is a quick hashing method. I'm using this one mainly becuaes from resarch, some of the other ones worked better with hashing. We can't store that roght now.
export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

// Verifies a password against the hash...
export function verifyPassword(password: string, storedHash: string): boolean {
  const computedHash = hashPassword(password); // First, hash the inputted password.

  // This is required to use timingSafeEqual
  const a = Buffer.from(computedHash, "hex");
  const b = Buffer.from(storedHash, "hex");

  if (a.length !== b.length) return false; // If it's not even the same length.. Is it really.. right?

  // I found this super cool thing too. This makes it so that timing based attacks can't use time, as it will return same time.
  // (AKA, attacks that figure out where a character is wrong based on how long the rejection takes)
  return timingSafeEqual(a, b);
}