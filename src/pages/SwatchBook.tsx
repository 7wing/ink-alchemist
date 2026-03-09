import { Link } from "react-router-dom";
import AppShell from "@/components/AppShell";
import SwatchCard from "@/components/SwatchCard";
import swatch1 from "@/assets/swatch-sample-1.jpg";
import swatch2 from "@/assets/swatch-sample-2.jpg";
import { Plus, PenTool } from "lucide-react";

const swatches = [
  { image: swatch1, inkName: "Oxblood", paper: "Tomoe River 52gsm", note: "Crazy red sheen in pooling areas" },
  { image: swatch2, inkName: "Blue Lightning", paper: "Cosmo Air Light", note: "Gold shimmer everywhere" },
  { image: swatch1, inkName: "Kon-peki", paper: "Rhodia 80gsm", note: "Perfect daily blue, great shading" },
  { image: swatch2, inkName: "Nitrogen", paper: "Tomoe River 52gsm", note: "Most insane sheen I've ever seen" },
  { image: swatch1, inkName: "Apache Sunset", paper: "Midori MD", note: "Incredible orange-to-yellow shading" },
  { image: swatch2, inkName: "Vinta Julio", paper: "Cosmo Air Light", note: "Subtle gold shimmer, lovely teal" },
];

const SwatchBook = () => (
  <AppShell>
    <div className="max-w-5xl mx-auto px-4 pt-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="font-display text-3xl md:text-4xl text-foreground">Swatch Book</h2>
        <div className="flex items-center gap-2">
          <Link
            to="/swatch-builder"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground font-label text-sm hover:bg-secondary/80 transition-colors border border-border"
          >
            <PenTool className="w-4 h-4" />
            <span className="hidden sm:inline">Swatch Builder</span>
          </Link>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-label text-sm hover:opacity-90 transition-opacity"
            aria-label="Upload new swatch photo"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Upload Photo</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {swatches.map((s, i) => (
          <SwatchCard key={`${s.inkName}-${s.paper}`} {...s} delay={i * 80} />
        ))}
      </div>
    </div>
  </AppShell>
);

export default SwatchBook;
