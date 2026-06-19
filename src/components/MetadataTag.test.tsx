import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MetadataTag from "./MetadataTag";

describe("MetadataTag", () => {
  it("renders ink tag as span without href", () => {
    render(<MetadataTag type="ink" name="Sailor Manyo Haha" />);
    expect(screen.getByText("[Ink: Sailor Manyo Haha]")).toBeInTheDocument();
    expect(screen.getByText("[Ink: Sailor Manyo Haha]").tagName).toBe("SPAN");
  });

  it("renders paper tag as span without href", () => {
    render(<MetadataTag type="paper" name="Tomoe River 68gsm" />);
    expect(screen.getByText("[Paper: Tomoe River 68gsm]")).toBeInTheDocument();
  });

  it("renders pen tag as span without href", () => {
    render(<MetadataTag type="pen" name="Pilot Custom 823" />);
    expect(screen.getByText("[Pen: Pilot Custom 823]")).toBeInTheDocument();
  });

  it("renders as Link when href is provided", () => {
    render(
      <MemoryRouter>
        <MetadataTag type="ink" name="Sailor" href="/codex/1" />
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: "[Ink: Sailor]" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/codex/1");
  });
});
