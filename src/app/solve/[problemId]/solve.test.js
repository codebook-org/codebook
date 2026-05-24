import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import SolvePage from "./page.js";
import { CodebookDatabaseAPI } from "@/lib/db.ts";

// intercepts any requests to db.ts
jest.mock("../../../lib/db.ts", () => ({
  CodebookDatabaseAPI: {
    getProblemById: jest.fn().mockResolvedValue({
      title: "Mock Title",
      description: "This is a mock description.",
    }),
    getUserById: jest.fn().mockResolvedValue({
      username: "bobjoe",
    }),
  },
}));

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>
}));

jest.mock('remark-math', () => ({
  __esModule: true,
  default: () => {}
}));

jest.mock('rehype-katex', () => ({
  __esModule: true,
  default: () => {}
}));

jest.mock('rehype-sanitize', () => ({
  __esModule: true,
  default: () => {},
  defaultSchema: { attributes: {} }
}));

jest.mock("./taunts.js", () => ({
  __esModule: true,
  default: ["Mocked Taunt Message"],
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

// tests whether SolvePage component displays problem title and description correctly
test("displays problem details", async () => {
  const mockParams = Promise.resolve({ problemId: "1" });
  const ResolvedPage = await SolvePage({ params: mockParams });
  render(ResolvedPage);

  // is the title displaying correctly?
  const title = await screen.findByText("Mock Title");
  expect(title).toBeInTheDocument();

  // is the description displaying correctly?
  const description = await screen.findByText("This is a mock description.");
  expect(description).toBeInTheDocument();
});

// tests whether SolvePage component displays test result card
test("displays test results", async () => {
  const mockParams = Promise.resolve({ problemId: "1" });
  const ResolvedPage = await SolvePage({ params: mockParams });
  render(ResolvedPage);

  // check if result card appears
  const resultsHeader = await screen.findByText(/test result/i);
  expect(resultsHeader).toBeInTheDocument();
});
