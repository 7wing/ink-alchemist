import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LightingBadge from "./LightingBadge";

describe("LightingBadge", () => {
  it("renders Natural Sunlight variant", () => {
    render(<LightingBadge lighting="Natural Sunlight" />);
    expect(screen.getByText("Natural Sunlight")).toBeInTheDocument();
  });

  it("renders Warm Lamp variant", () => {
    render(<LightingBadge lighting="Warm Lamp" />);
    expect(screen.getByText("Warm Lamp")).toBeInTheDocument();
  });

  it("renders Scanner variant", () => {
    render(<LightingBadge lighting="Scanner" />);
    expect(screen.getByText("Scanner")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<LightingBadge lighting="Scanner" className="absolute top-0" />);
    expect(screen.getByText("Scanner")).toHaveClass("absolute", "top-0");
  });
});
