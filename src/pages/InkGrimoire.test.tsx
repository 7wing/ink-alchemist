import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import InkGrimoire from "./InkGrimoire";

vi.mock("@/components/ui/sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import { toast } from "@/components/ui/sonner";

describe("InkGrimoire", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the page header", () => {
    render(<InkGrimoire />);
    expect(screen.getByText("Ink Grimoire · Cataloguer's Desk")).toBeInTheDocument();
  });

  it("renders the Vitals section with inputs", () => {
    render(<InkGrimoire />);
    expect(screen.getByLabelText(/brand/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/line name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/color name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/release year/i)).toBeInTheDocument();
  });

  it("renders the Ink Identity section with selects and color picker", () => {
    render(<InkGrimoire />);
    expect(screen.getByText("Ink Identity")).toBeInTheDocument();
    expect(screen.getByLabelText(/hex color/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Color picker")).toBeInTheDocument();
    expect(screen.getByLabelText("Live color preview")).toBeInTheDocument();
  });

  it("renders the Performance Metrics section with all sliders", () => {
    render(<InkGrimoire />);
    expect(screen.getByText("Performance Metrics")).toBeInTheDocument();
    const section = screen.getByRole("heading", { name: "Performance Metrics" }).closest("section");
    expect(section).toBeInTheDocument();
    if (section) {
      const { getByText } = within(section);
      expect(getByText("Sheen")).toBeInTheDocument();
      expect(getByText("Shading")).toBeInTheDocument();
      expect(getByText("Shimmer")).toBeInTheDocument();
      expect(getByText("Saturation")).toBeInTheDocument();
      expect(getByText("Flow")).toBeInTheDocument();
      expect(getByText("Dry Time")).toBeInTheDocument();
    }
  });

  it("renders the Grimoire Notes textarea", () => {
    render(<InkGrimoire />);
    expect(screen.getByPlaceholderText(/your impressions/i)).toBeInTheDocument();
  });

  it("renders Save Entry and Cancel buttons", () => {
    render(<InkGrimoire />);
    expect(screen.getByRole("button", { name: /save entry/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows validation errors when saving with empty required fields", async () => {
    render(<InkGrimoire />);
    fireEvent.click(screen.getByRole("button", { name: /save entry/i }));
    await waitFor(() => {
      expect(screen.getByText("Brand is required")).toBeInTheDocument();
      expect(screen.getByText("Line name is required")).toBeInTheDocument();
      expect(screen.getByText("Color name is required")).toBeInTheDocument();
    });
  });

  it("shows error for invalid release year", async () => {
    render(<InkGrimoire />);
    const yearInput = screen.getByLabelText(/release year/i);
    fireEvent.change(yearInput, { target: { value: "99" } });
    fireEvent.click(screen.getByRole("button", { name: /save entry/i }));
    await waitFor(() => {
      expect(screen.getByText("Year must be 4 digits")).toBeInTheDocument();
    });
  });

  it("shows error for invalid hex color", async () => {
    render(<InkGrimoire />);
    const hexInput = screen.getByLabelText(/hex color/i);
    fireEvent.change(hexInput, { target: { value: "not-a-color" } });
    fireEvent.click(screen.getByRole("button", { name: /save entry/i }));
    await waitFor(() => {
      expect(screen.getByText("Invalid hex color")).toBeInTheDocument();
    });
  });

  it("updates color preview when hex input changes", () => {
    render(<InkGrimoire />);
    const hexInput = screen.getByLabelText(/hex color/i);
    fireEvent.change(hexInput, { target: { value: "#ff0000" } });
    const preview = screen.getByLabelText("Live color preview");
    expect(preview).toHaveStyle("background-color: rgb(255, 0, 0)");
  });

  it("saves a valid entry and shows toast", async () => {
    render(<InkGrimoire />);
    fireEvent.change(screen.getByLabelText(/brand/i), { target: { value: "Test Brand" } });
    fireEvent.change(screen.getByLabelText(/line name/i), { target: { value: "Test Line" } });
    fireEvent.change(screen.getByLabelText(/color name/i), { target: { value: "Test Color" } });
    fireEvent.change(screen.getByLabelText(/hex color/i), { target: { value: "#123456" } });

    fireEvent.click(screen.getByRole("button", { name: /save entry/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Entry saved to grimoire");
    });
  });

  it("adds a new entry to Recent Entries after saving", async () => {
    render(<InkGrimoire />);
    fireEvent.change(screen.getByLabelText(/brand/i), { target: { value: "New Brand" } });
    fireEvent.change(screen.getByLabelText(/line name/i), { target: { value: "New Line" } });
    fireEvent.change(screen.getByLabelText(/color name/i), { target: { value: "New Color" } });
    fireEvent.change(screen.getByLabelText(/hex color/i), { target: { value: "#abcdef" } });

    fireEvent.click(screen.getByRole("button", { name: /save entry/i }));

    await waitFor(() => {
      expect(screen.getByText("New Brand New Line")).toBeInTheDocument();
      expect(screen.getByText("New Color")).toBeInTheDocument();
    });
  });

  it("resets form on Cancel", () => {
    render(<InkGrimoire />);
    const brandInput = screen.getByLabelText(/brand/i) as HTMLInputElement;
    fireEvent.change(brandInput, { target: { value: "Something" } });
    expect(brandInput.value).toBe("Something");

    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(brandInput.value).toBe("");
  });

  it("renders initial mock entries in Recent Entries", () => {
    render(<InkGrimoire />);
    expect(screen.getByText("Sailor Manyo")).toBeInTheDocument();
    expect(screen.getByText("Haha")).toBeInTheDocument();
    expect(screen.getByText("Diamine Standard")).toBeInTheDocument();
    expect(screen.getByText("Oxblood")).toBeInTheDocument();
    expect(screen.getByText("Pilot Iroshizuku")).toBeInTheDocument();
    expect(screen.getByText("Kon-peki")).toBeInTheDocument();
  });

  it("renders color family and base property tags on entries", () => {
    render(<InkGrimoire />);
    expect(screen.getAllByText("Green").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Shading").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Red").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Sheen").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Blue").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Standard").length).toBeGreaterThanOrEqual(1);
  });

  it("renders timestamps on initial entries", () => {
    render(<InkGrimoire />);
    const timestamps = screen.getAllByText(/\w{3}\s\d{1,2},?\s/);
    expect(timestamps.length).toBeGreaterThanOrEqual(3);
  });

  it("allows entering release year", () => {
    render(<InkGrimoire />);
    const yearInput = screen.getByLabelText(/release year/i) as HTMLInputElement;
    fireEvent.change(yearInput, { target: { value: "2023" } });
    expect(yearInput.value).toBe("2023");
  });

  it("allows entering notes", () => {
    render(<InkGrimoire />);
    const notesInput = screen.getByPlaceholderText(/your impressions/i) as HTMLTextAreaElement;
    fireEvent.change(notesInput, { target: { value: "Great ink!" } });
    expect(notesInput.value).toBe("Great ink!");
  });
});
