import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SimilarityBadge from "./SimilarityBadge";

describe("SimilarityBadge", () => {
  it("renders high similarity with green styling", () => {
    render(<SimilarityBadge score={87} />);
    expect(screen.getByText("87% similar · possible dupe")).toBeInTheDocument();
    expect(screen.getByText("87% similar · possible dupe")).toHaveClass(
      "bg-emerald-900/30"
    );
  });

  it("renders medium similarity with yellow styling", () => {
    render(<SimilarityBadge score={65} />);
    expect(screen.getByText("65% similar · possible dupe")).toBeInTheDocument();
    expect(screen.getByText("65% similar · possible dupe")).toHaveClass(
      "bg-yellow-900/30"
    );
  });

  it("renders low similarity with red styling", () => {
    render(<SimilarityBadge score={30} />);
    expect(screen.getByText("30% similar · possible dupe")).toBeInTheDocument();
    expect(screen.getByText("30% similar · possible dupe")).toHaveClass(
      "bg-red-900/30"
    );
  });
});
