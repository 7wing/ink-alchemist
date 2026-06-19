import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import InkSwap from "./InkSwap";

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

describe("InkSwap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page header", () => {
    render(<InkSwap />);
    expect(screen.getByText("Ink Swap · Sample Economy")).toBeInTheDocument();
  });

  it("renders the List an Ink button", () => {
    render(<InkSwap />);
    expect(screen.getByRole("button", { name: /list an ink/i })).toBeInTheDocument();
  });

  it("renders the matchmaker banner by default", () => {
    render(<InkSwap />);
    expect(
      screen.getByText(/The Scriptorium found a match for you/)
    ).toBeInTheDocument();
  });

  it("hides the matchmaker banner when Dismiss is clicked", () => {
    render(<InkSwap />);
    const dismissBtn = screen.getByRole("button", { name: /dismiss/i });
    fireEvent.click(dismissBtn);
    expect(
      screen.queryByText(/The Scriptorium found a match for you/)
    ).not.toBeInTheDocument();
  });

  it("shows a toast when Propose Swap is clicked", () => {
    render(<InkSwap />);
    const proposeBtn = screen.getByRole("button", { name: /propose swap/i });
    fireEvent.click(proposeBtn);
    expect(toast.success).toHaveBeenCalledWith("Swap proposal sent!");
  });

  it("renders Available Samples tab with mock listings", () => {
    render(<InkSwap />);
    expect(screen.getByText("Sailor Manyo Haha")).toBeInTheDocument();
    expect(screen.getByText("Diamine Oxblood")).toBeInTheDocument();
    expect(screen.getByText("Pilot Iroshizuku Chiku-rin")).toBeInTheDocument();
  });

  it("renders tags on listing cards", () => {
    render(<InkSwap />);
    expect(screen.getAllByText("Shimmer").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("Tomoe River tested").length).toBeGreaterThanOrEqual(2);
  });

  it("moves a listing to Pending Swaps when Request Sample is clicked", () => {
    render(<InkSwap />);
    const requestBtn = screen.getAllByRole("button", { name: /request sample/i })[0];
    fireEvent.click(requestBtn);
    expect(toast.success).toHaveBeenCalledWith("Requested sample of Sailor Manyo Haha");
  });

  it("has My Listings and Pending Swaps tab triggers", () => {
    render(<InkSwap />);
    expect(screen.getByRole("tab", { name: /my listings/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /pending swaps/i })).toBeInTheDocument();
  });

  it("shows empty state when all available samples are requested", () => {
    render(<InkSwap />);
    const requestButtons = screen.getAllByRole("button", { name: /request sample/i });
    requestButtons.forEach((btn) => fireEvent.click(btn));
    expect(screen.getByText(/No available samples right now./)).toBeInTheDocument();
  });

  it("opens the List an Ink dialog when the button is clicked", () => {
    render(<InkSwap />);
    const listBtn = screen.getByRole("button", { name: /list an ink/i });
    fireEvent.click(listBtn);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /list an ink/i })).toBeInTheDocument();
  });

  it("adds a new listing through the dialog", () => {
    render(<InkSwap />);
    fireEvent.click(screen.getByRole("button", { name: /list an ink/i }));

    const nameInput = screen.getByLabelText(/ink name/i);
    const priceInput = screen.getByLabelText(/price or swap value/i);
    const sizeInput = screen.getByLabelText(/vial size/i);

    fireEvent.change(nameInput, { target: { value: "Test Ink" } });
    fireEvent.change(priceInput, { target: { value: "$5.00" } });
    fireEvent.change(sizeInput, { target: { value: "3ml vial" } });

    fireEvent.click(screen.getByRole("button", { name: /save listing/i }));

    expect(toast.success).toHaveBeenCalledWith("Listing added to My Listings");
  });

  it("does not add a listing if required fields are empty", () => {
    render(<InkSwap />);
    fireEvent.click(screen.getByRole("button", { name: /list an ink/i }));
    fireEvent.click(screen.getByRole("button", { name: /save listing/i }));
    expect(toast.success).not.toHaveBeenCalled();
  });

  it("cancels the dialog when Cancel is clicked", () => {
    render(<InkSwap />);
    fireEvent.click(screen.getByRole("button", { name: /list an ink/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders WaxSealBadge with correct status on listings", () => {
    render(<InkSwap />);
    expect(screen.getAllByText("available").length).toBeGreaterThanOrEqual(6);
  });

  it("renders price on listing cards", () => {
    render(<InkSwap />);
    expect(screen.getByText("$4.00")).toBeInTheDocument();
    expect(screen.getByText("$3.50")).toBeInTheDocument();
  });

  it("renders seller info on listing cards", () => {
    render(<InkSwap />);
    expect(screen.getByText(/by QuillMaster42/)).toBeInTheDocument();
    expect(screen.getByText(/by InkAlchemist/)).toBeInTheDocument();
  });

  it("renders all three tabs", () => {
    render(<InkSwap />);
    expect(screen.getByRole("tab", { name: /available samples/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /my listings/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /pending swaps/i })).toBeInTheDocument();
  });

  it("shows pending item in Pending Swaps after requesting a sample", () => {
    render(<InkSwap />);
    const requestBtn = screen.getAllByRole("button", { name: /request sample/i })[1];
    fireEvent.click(requestBtn);
    expect(toast.success).toHaveBeenCalledWith("Requested sample of Diamine Oxblood");
  });
});
