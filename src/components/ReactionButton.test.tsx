import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ReactionButton from "./ReactionButton";

describe("ReactionButton", () => {
  it("renders icon, label and initial count", () => {
    render(
      <ReactionButton
        icon={<span data-testid="icon">★</span>}
        label="Ink Splat"
        count={14}
      />
    );
    expect(screen.getByText("Ink Splat")).toBeInTheDocument();
    expect(screen.getByText("14")).toBeInTheDocument();
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("toggles active and increments count when uncontrolled", () => {
    render(
      <ReactionButton
        icon={<span>★</span>}
        label="Ink Splat"
        count={10}
      />
    );
    const btn = screen.getByRole("button");
    expect(btn).not.toHaveClass("bg-primary/20");
    fireEvent.click(btn);
    expect(screen.getByText("11")).toBeInTheDocument();
    expect(btn).toHaveClass("bg-primary/20");
    fireEvent.click(btn);
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("calls external onClick and uses controlled count/active", () => {
    const handleClick = vi.fn();
    render(
      <ReactionButton
        icon={<span>★</span>}
        label="Ink Splat"
        count={20}
        active={true}
        onClick={handleClick}
      />
    );
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("bg-primary/20");
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText("20")).toBeInTheDocument();
  });
});
