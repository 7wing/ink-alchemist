import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CurrentlyInked from "./CurrentlyInked";

vi.mock("@/components/ui/sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from "@/components/ui/sonner";

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("CurrentlyInked", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page header", () => {
    renderWithRouter(<CurrentlyInked />);
    expect(screen.getByText("Currently Inked")).toBeInTheDocument();
  });

  it("renders the Log Today's Setup button with Plus icon", () => {
    renderWithRouter(<CurrentlyInked />);
    const btn = screen.getByRole("button", { name: /log today's setup/i });
    expect(btn).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    renderWithRouter(<CurrentlyInked />);
    expect(
      screen.getByText(/a feed of daily setups from the community/i)
    ).toBeInTheDocument();
  });

  it("renders at least 4 mock posts", () => {
    renderWithRouter(<CurrentlyInked />);
    expect(screen.getByText(/inkwell_wanderer/)).toBeInTheDocument();
    expect(screen.getByText(/nib_nomad/)).toBeInTheDocument();
    expect(screen.getByText(/sheen_seeker/)).toBeInTheDocument();
    expect(screen.getByText(/paper_purists/)).toBeInTheDocument();
  });

  it("renders mock post timeago values", () => {
    renderWithRouter(<CurrentlyInked />);
    expect(screen.getByText(/2h ago/)).toBeInTheDocument();
    expect(screen.getByText(/5h ago/)).toBeInTheDocument();
    expect(screen.getByText(/8h ago/)).toBeInTheDocument();
    expect(screen.getByText(/1d ago/)).toBeInTheDocument();
  });

  it("renders mock post captions", () => {
    renderWithRouter(<CurrentlyInked />);
    expect(
      screen.getByText(/Finally testing my new Sailor Manyo Haha on Tomoe River/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Late night journaling session with J\. Herbin Emeraude de Chivor/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Scanner shot of Organics Studio Nitrogen on Cosmo Air Light/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Testing Diamine Oxblood on cotton paper for a commission piece/)
    ).toBeInTheDocument();
  });

  it("renders lighting badges on posts", () => {
    renderWithRouter(<CurrentlyInked />);
    expect(screen.getAllByText(/Natural Sunlight/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Warm Lamp/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Scanner/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders metadata tags for ink, paper, and pen", () => {
    renderWithRouter(<CurrentlyInked />);
    expect(screen.getByText(/\[Ink: Sailor Manyo Haha\]/)).toBeInTheDocument();
    expect(screen.getByText(/\[Paper: Tomoe River 68gsm\]/)).toBeInTheDocument();
    expect(screen.getByText(/\[Pen: Pilot Custom 823\]/)).toBeInTheDocument();
    expect(screen.getByText(/\[Ink: J\. Herbin Emeraude de Chivor\]/)).toBeInTheDocument();
    expect(screen.getByText(/\[Paper: Rhodia Dot Pad\]/)).toBeInTheDocument();
    expect(screen.getByText(/\[Pen: Lamy 2000\]/)).toBeInTheDocument();
  });

  it("renders clickable ink tags as links", () => {
    renderWithRouter(<CurrentlyInked />);
    const inkLink = screen.getByRole("link", {
      name: /\[Ink: Sailor Manyo Haha\]/,
    });
    expect(inkLink).toBeInTheDocument();
    expect(inkLink).toHaveAttribute("href", "/codex/sailor-manyo-haha");
  });

  it("renders non-ink tags as spans", () => {
    renderWithRouter(<CurrentlyInked />);
    const paperTag = screen.getByText(/\[Paper: Tomoe River 68gsm\]/);
    expect(paperTag.tagName.toLowerCase()).toBe("span");
  });

  it("renders reaction buttons with initial counts", () => {
    renderWithRouter(<CurrentlyInked />);
    expect(screen.getByText("14")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("22")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
  });

  it("toggles reaction count when a reaction is clicked", () => {
    renderWithRouter(<CurrentlyInked />);
    const inkSplatButtons = screen.getAllByText("Ink Splat");
    fireEvent.click(inkSplatButtons[0]);
    expect(screen.getByText("15")).toBeInTheDocument();
    fireEvent.click(inkSplatButtons[0]);
    expect(screen.getByText("14")).toBeInTheDocument();
  });

  it("opens the Log Setup dialog when the button is clicked", () => {
    renderWithRouter(<CurrentlyInked />);
    const btn = screen.getByRole("button", { name: /log today's setup/i });
    fireEvent.click(btn);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /log today's setup/i })
    ).toBeInTheDocument();
  });

  it("closes the dialog when Cancel is clicked", () => {
    renderWithRouter(<CurrentlyInked />);
    fireEvent.click(screen.getByRole("button", { name: /log today's setup/i }));
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("adds a new post to the top of the feed after submitting", () => {
    renderWithRouter(<CurrentlyInked />);
    fireEvent.click(screen.getByRole("button", { name: /log today's setup/i }));

    const captionInput = screen.getByLabelText(/caption/i);
    fireEvent.change(captionInput, { target: { value: "My new setup today" } });

    fireEvent.click(screen.getByRole("button", { name: /log setup/i }));

    expect(toast.success).toHaveBeenCalledWith("Setup logged!");
    expect(screen.getByText((content) => content.includes("@You"))).toBeInTheDocument();
    expect(screen.getByText(/My new setup today/)).toBeInTheDocument();
    expect(screen.getByText(/Just now/)).toBeInTheDocument();
  });

  it("does not add a post if caption is empty", () => {
    renderWithRouter(<CurrentlyInked />);
    fireEvent.click(screen.getByRole("button", { name: /log today's setup/i }));
    fireEvent.click(screen.getByRole("button", { name: /log setup/i }));
    expect(toast.error).toHaveBeenCalledWith("Please add a caption");
  });

  it("renders metadata tags in the new post when tags are provided", () => {
    renderWithRouter(<CurrentlyInked />);
    fireEvent.click(screen.getByRole("button", { name: /log today's setup/i }));

    fireEvent.change(screen.getByLabelText(/caption/i), {
      target: { value: "Setup with tags" },
    });
    fireEvent.change(screen.getByLabelText(/ink tag/i), {
      target: { value: "Sailor Ink" },
    });
    fireEvent.change(screen.getByLabelText(/paper tag/i), {
      target: { value: "Rhodia" },
    });
    fireEvent.change(screen.getByLabelText(/pen tag/i), {
      target: { value: "Pilot Pen" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log setup/i }));

    expect(screen.getByText(/\[Ink: Sailor Ink\]/)).toBeInTheDocument();
    expect(screen.getByText(/\[Paper: Rhodia\]/)).toBeInTheDocument();
    expect(screen.getByText(/\[Pen: Pilot Pen\]/)).toBeInTheDocument();
  });

  it("has a selectable lighting type in the dialog", () => {
    renderWithRouter(<CurrentlyInked />);
    fireEvent.click(screen.getByRole("button", { name: /log today's setup/i }));
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders color picker buttons in the dialog", () => {
    renderWithRouter(<CurrentlyInked />);
    fireEvent.click(screen.getByRole("button", { name: /log today's setup/i }));
    expect(
      screen.getByRole("button", { name: /Select Teal colour/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Select Green colour/i })
    ).toBeInTheDocument();
  });
});
