import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SolvePage from "./page.js";
import { CodebookDatabaseAPI } from "@/lib/db.ts";

jest.mock("../../../auth", () => ({
  auth: jest.fn(() => Promise.resolve({ user: { id: "test-user-id" } })),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: { user: { id: "test-user-id", name: "Test User" } },
    status: "authenticated",
  })),
}));

jest.mock("../../../lib/db.ts", () => ({
  CodebookDatabaseAPI: {
    Problems: {
      getProblemByProblemId: jest.fn().mockResolvedValue({
        problemId: "1",
        userId: "42",
        title: "Mock Title",
        description: "This is a mock description.",
        likeCount: 0,
        dislikeCount: 0,
      }),
      UserSolves: {
        getUsersSolvedProblem: jest.fn().mockResolvedValue([]),
        getUserSolvedProblem: jest.fn().mockResolvedValue(true),
      },
      Votes: {
        getUserProblemVote: jest.fn().mockResolvedValue(null),
      },
    },
    Users: {
      getUserById: jest.fn().mockResolvedValue({
        username: "bobjoe",
      }),
    },
  },
}));

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

jest.mock("remark-math", () => ({
  __esModule: true,
  default: () => {},
}));

jest.mock("rehype-katex", () => ({
  __esModule: true,
  default: () => {},
}));

jest.mock("rehype-sanitize", () => ({
  __esModule: true,
  default: () => {},
  defaultSchema: { attributes: {} },
}));

jest.mock("../../../components/SplitPane", () => {
  return function MockSplitPane({ left, right }) {
    return (
      <div data-testid="mock-split-pane">
        <div>{left}</div>
        <div>{right}</div>
      </div>
    );
  };
});

jest.mock("react-resizable-panels", () => ({
  Group: ({ children }) => <div data-testid="mock-group">{children}</div>,
  PanelGroup: ({ children }) => (
    <div data-testid="mock-panel-group">{children}</div>
  ),
  Panel: ({ children }) => <div data-testid="mock-panel">{children}</div>,
  Separator: () => <div data-testid="mock-separator" />,
}));

test("displays problem details", async () => {
  const mockParams = Promise.resolve({ problemId: "1" });
  const ResolvedPage = await SolvePage({ params: mockParams });
  render(ResolvedPage);

  const title = await screen.findByText("Mock Title");
  expect(title).toBeInTheDocument();

  const description = await screen.findByText("This is a mock description.");
  expect(description).toBeInTheDocument();
});

test("displays test results", async () => {
  const mockParams = Promise.resolve({ problemId: "1" });
  const ResolvedPage = await SolvePage({ params: mockParams });
  render(ResolvedPage);

  const resultsHeader = await screen.findByText(/test result/i);
  expect(resultsHeader).toBeInTheDocument();
});
