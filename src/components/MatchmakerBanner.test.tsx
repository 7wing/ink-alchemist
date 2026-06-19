import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import MatchmakerBanner from "./MatchmakerBanner";

describe("MatchmakerBanner", () => {
  const userA = { name: "Alice", ink: "Ox Blood", color: "#8a0303" };
  const userB = { name: "Bob", ink: "Apache Sunset", color: "#d46a1e" };

  it("renders user names and inks", () => {
    render(
      <MatchmakerBanner
        userA={userA}
        userB={userB}
        onPropose={vi.fn()}
        onDismiss={vi.fn()}
      />
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Ox Blood")).toBeInTheDocument();
    expect(screen.getByText("Apache Sunset")).toBeInTheDocument();
  });

  it("calls onDismiss when dismiss button is clicked", () => {
    const onDismiss = vi.fn();
    render(
      <MatchmakerBanner
        userA={userA}
        userB={userB}
        onPropose={vi.fn()}
        onDismiss={onDismiss}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("calls onPropose when propose button is clicked", () => {
    const onPropose = vi.fn();
    render(
      <MatchmakerBanner
        userA={userA}
        userB={userB}
        onPropose={onPropose}
        onDismiss={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /propose swap/i }));
    expect(onPropose).toHaveBeenCalledTimes(1);
  });

  it("renders the sparkles text", () => {
    render(
      <MatchmakerBanner
        userA={userA}
        userB={userB}
        onPropose={vi.fn()}
        onDismiss={vi.fn()}
      />
    );
    expect(
      screen.getByText(/The Scriptorium found a match for you/)
    ).toBeInTheDocument();
  });
});
