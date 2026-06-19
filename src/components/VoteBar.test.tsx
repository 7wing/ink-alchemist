import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import VoteBar from "./VoteBar";

describe("VoteBar", () => {
  it("renders labels and vote counts", () => {
    render(
      <VoteBar
        leftLabel="Lefty"
        rightLabel="Righty"
        leftVotes={30}
        rightVotes={70}
      />
    );
    expect(screen.getByText("Lefty")).toBeInTheDocument();
    expect(screen.getByText("Righty")).toBeInTheDocument();
    expect(screen.getByText("(30)")).toBeInTheDocument();
    expect(screen.getByText("(70)")).toBeInTheDocument();
  });

  it("calls onVoteLeft and onVoteRight", () => {
    const onVoteLeft = vi.fn();
    const onVoteRight = vi.fn();
    render(
      <VoteBar
        leftLabel="A"
        rightLabel="B"
        leftVotes={10}
        rightVotes={10}
        onVoteLeft={onVoteLeft}
        onVoteRight={onVoteRight}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /vote for A/i }));
    expect(onVoteLeft).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: /vote for B/i }));
    expect(onVoteRight).toHaveBeenCalledTimes(1);
  });

  it("handles zero total votes with 50/50 split", () => {
    render(
      <VoteBar
        leftLabel="A"
        rightLabel="B"
        leftVotes={0}
        rightVotes={0}
      />
    );
    const bars = screen.getAllByRole("button").filter(
      (btn) => btn.getAttribute("aria-label")?.startsWith("Vote for")
    );
    expect(bars).toHaveLength(2);
    expect(bars[0]).toHaveStyle("width: 50%");
    expect(bars[1]).toHaveStyle("width: 50%");
  });
});
