import { problems } from "@/lib/data.ts";

test("N-Queens exists", () => {
  const problem = problems.find((p) => p.id.toString() === "1");
  expect(problem.title).toBe("N-Queens");
});
