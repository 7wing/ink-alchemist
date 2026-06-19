import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import InkBattle from "./InkBattle";

vi.mock("@/components/ui/sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/assets/inkwell-blue.png", () => ({ default: "blue.png" }));
vi.mock("@/assets/inkwell-green.png", () => ({ default: "green.png" }));
vi.mock("@/assets/inkwell-red.png", () => ({ default: "red.png" }));
vi.mock("@/assets/inkwell-gold.png", () => ({ default: "gold.png" }));

import { toast } from "@/components/ui/sonner";

describe("InkBattle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page header", () => {
    render(<InkBattle />);
    expect(screen.getByText("Ink Battles · Dupe Finder")).toBeInTheDocument();
  });

  it("renders the Comparison Builder section", () => {
    render(<InkBattle />);
    expect(screen.getByText("Comparison Builder")).toBeInTheDocument();
  });

  it("renders initial ink slots", () => {
    render(<InkBattle />);
    expect(screen.getAllByText("Diamine Oxblood").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Noodler's Apache Sunset").length).toBeGreaterThanOrEqual(1);
  });

  it("renders Compare Side by Side button", () => {
    render(<InkBattle />);
    expect(screen.getByRole("button", { name: /compare side by side/i })).toBeInTheDocument();
  });

  it("shows side-by-side panel when Compare button is clicked", () => {
    render(<InkBattle />);
    fireEvent.click(screen.getByRole("button", { name: /compare side by side/i }));
    expect(screen.getAllByText("Sheen").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("Shading").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("Shimmer").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("Saturation").length).toBeGreaterThanOrEqual(2);
  });

  it("renders similarity badge after comparison is shown", () => {
    render(<InkBattle />);
    fireEvent.click(screen.getByRole("button", { name: /compare side by side/i }));
    const badge = screen.getByText(/% similar · possible dupe/);
    expect(badge).toBeInTheDocument();
  });

  it("cycles ink when Change button is clicked", () => {
    render(<InkBattle />);
    const changeButtons = screen.getAllByRole("button", { name: /change/i });
    // Diamine Oxblood appears in builder slot and community battle before clicking
    const initialCount = screen.queryAllByText("Diamine Oxblood").length;
    fireEvent.click(changeButtons[0]);
    // The builder slot should have cycled away from Diamine Oxblood
    expect(screen.queryAllByText("Diamine Oxblood").length).toBeLessThan(initialCount);
  });

  it("renders Community Battles section", () => {
    render(<InkBattle />);
    expect(screen.getByText("Community Battles")).toBeInTheDocument();
  });

  it("renders at least 3 community battle cards", () => {
    render(<InkBattle />);
    expect(screen.getByText(/Battle: Diamine Oxblood vs Noodler's Apache Sunset/)).toBeInTheDocument();
    expect(screen.getByText(/Battle: Pilot Iroshizuku Kon-peki vs Organics Studio Nitrogen/)).toBeInTheDocument();
    expect(screen.getByText(/Battle: J. Herbin Emeraude de Chivor vs Sailor Tokiwa-matsu/)).toBeInTheDocument();
  });

  it("renders vote bars in community battles", () => {
    render(<InkBattle />);
    const voteBars = screen.getAllByRole("button").filter(
      (btn) => btn.getAttribute("aria-label")?.startsWith("Vote for")
    );
    expect(voteBars.length).toBeGreaterThanOrEqual(2);
  });

  it("updates community battle votes when Vote for left is clicked", () => {
    render(<InkBattle />);
    const leftVoteButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.getAttribute("aria-label")?.startsWith("Vote for Diamine"));
    if (leftVoteButtons.length > 0) {
      fireEvent.click(leftVoteButtons[0]);
    }
    expect(screen.getByText("(343)")).toBeInTheDocument();
  });

  it("updates community battle votes when Vote for right is clicked", () => {
    render(<InkBattle />);
    const rightVoteButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.getAttribute("aria-label")?.startsWith("Vote for Noodler's"));
    if (rightVoteButtons.length > 0) {
      fireEvent.click(rightVoteButtons[0]);
    }
    expect(screen.getByText("(290)")).toBeInTheDocument();
  });

  it("allows adding a third slot", () => {
    render(<InkBattle />);
    fireEvent.click(screen.getByRole("button", { name: /add slot/i }));
    const changeButtons = screen.getAllByRole("button", { name: /change/i });
    expect(changeButtons.length).toBe(3);
  });

  it("allows removing a slot back to two", () => {
    render(<InkBattle />);
    fireEvent.click(screen.getByRole("button", { name: /add slot/i }));
    fireEvent.click(screen.getByRole("button", { name: /remove slot/i }));
    const changeButtons = screen.getAllByRole("button", { name: /change/i });
    expect(changeButtons.length).toBe(2);
  });

  it("shows voting buttons in side-by-side panel", () => {
    render(<InkBattle />);
    fireEvent.click(screen.getByRole("button", { name: /compare side by side/i }));
    const voteButtons = screen.getAllByRole("button", { name: /vote best performance/i });
    expect(voteButtons.length).toBeGreaterThanOrEqual(2);
  });

  it("records a comparison vote and shows toast", () => {
    render(<InkBattle />);
    fireEvent.click(screen.getByRole("button", { name: /compare side by side/i }));
    const voteButtons = screen.getAllByRole("button", { name: /vote best performance/i });
    fireEvent.click(voteButtons[0]);
    expect(toast.success).toHaveBeenCalledWith("Vote recorded");
  });

  it("renders comment previews in community battles", () => {
    render(<InkBattle />);
    expect(
      screen.getByText(/Oxblood dries faster, but Apache has that wild shading gradient…/)
    ).toBeInTheDocument();
  });

  it("renders comment authors in community battles", () => {
    render(<InkBattle />);
    expect(screen.getByText(/ShadingSage/)).toBeInTheDocument();
    expect(screen.getByText(/SheenHunter/)).toBeInTheDocument();
    expect(screen.getByText(/DailyScribe/)).toBeInTheDocument();
  });

  it("renders brand names in ink slots", () => {
    render(<InkBattle />);
    expect(screen.getByText("Diamine")).toBeInTheDocument();
    expect(screen.getByText("Noodler's")).toBeInTheDocument();
  });

  it("disables Add Slot when 3 slots are shown", () => {
    render(<InkBattle />);
    fireEvent.click(screen.getByRole("button", { name: /add slot/i }));
    const addBtn = screen.getByRole("button", { name: /add slot/i });
    expect(addBtn).toBeDisabled();
  });

  it("disables Remove Slot when 2 slots are shown", () => {
    render(<InkBattle />);
    const removeBtn = screen.getByRole("button", { name: /remove slot/i });
    expect(removeBtn).toBeDisabled();
  });
});
