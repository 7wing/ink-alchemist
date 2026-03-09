import { useState } from "react";
import AppShell from "@/components/AppShell";
import SearchBar from "@/components/SearchBar";
import ParchmentCard from "@/components/ParchmentCard";
import PropertyBar from "@/components/PropertyBar";
import WaxSealBadge from "@/components/WaxSealBadge";
import inkBlue from "@/assets/inkwell-blue.png";
import inkRed from "@/assets/inkwell-red.png";
import inkGreen from "@/assets/inkwell-green.png";
import inkGold from "@/assets/inkwell-gold.png";

const inks = [
  { id: 1, image: inkBlue, name: "Kon-peki", brand: "Pilot Iroshizuku", series: "Iroshizuku", status: "current" as const, color: "#2244aa", shimmer: 0, sheen: 30, shading: 85, saturation: 70, dryTime: 25, waterResist: 15 },
  { id: 2, image: inkRed, name: "Oxblood", brand: "Diamine", series: "Standard", status: "current" as const, color: "#8B0000", shimmer: 0, sheen: 45, shading: 90, saturation: 80, dryTime: 30, waterResist: 20 },
  { id: 3, image: inkGreen, name: "Nitrogen", brand: "Organics Studio", series: "Elements", status: "limited" as const, color: "#006D77", shimmer: 90, sheen: 95, shading: 40, saturation: 75, dryTime: 60, waterResist: 10 },
  { id: 4, image: inkGold, name: "Caroube de Chypre", brand: "J. Herbin", series: "1670 Anniversary", status: "current" as const, color: "#DAA520", shimmer: 70, sheen: 20, shading: 55, saturation: 60, dryTime: 45, waterResist: 25 },
  { id: 5, image: inkBlue, name: "Sailor Yama-dori", brand: "Sailor", series: "Jentle Four Seasons", status: "discontinued" as const, color: "#2E5B5B", shimmer: 0, sheen: 85, shading: 70, saturation: 65, dryTime: 35, waterResist: 30 },
  { id: 6, image: inkRed, name: "Apache Sunset", brand: "Noodler's", series: "Standard", status: "current" as const, color: "#FF6600", shimmer: 0, sheen: 10, shading: 95, saturation: 90, dryTime: 20, waterResist: 45 },
];

const statusVariant = { current: "default" as const, limited: "limited" as const, discontinued: "discontinued" as const };

const InkCodex = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = inks.filter(
    i => i.name.toLowerCase().includes(search.toLowerCase()) || i.brand.toLowerCase().includes(search.toLowerCase())
  );
  const detail = inks.find(i => i.id === selected);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">Ink Codex</h2>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, brand, or series…" />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ink list */}
          <div className="lg:col-span-2 space-y-3">
            {filtered.map((ink, i) => (
              <ParchmentCard key={ink.id} delay={i * 80} className="cursor-pointer hover:border-primary/30 transition-colors">
                <button
                  onClick={() => setSelected(ink.id)}
                  className="w-full flex items-center gap-4 text-left"
                  aria-label={`View ${ink.name} by ${ink.brand}`}
                >
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <div className="absolute inset-0 rounded-full blur-xl opacity-20" style={{ backgroundColor: ink.color }} />
                    <img src={ink.image} alt="" className="relative w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-base font-semibold text-foreground">{ink.name}</h3>
                      <WaxSealBadge label={ink.status} variant={statusVariant[ink.status]} />
                    </div>
                    <p className="text-xs text-muted-foreground font-label">{ink.brand} · {ink.series}</p>
                    <div className="flex gap-4 mt-2">
                      <PropertyBar label="Sheen" value={ink.sheen} color={ink.color} />
                      <PropertyBar label="Shading" value={ink.shading} color={ink.color} />
                    </div>
                  </div>
                  <div className="w-4 h-4 rounded-full flex-shrink-0 border border-border" style={{ backgroundColor: ink.color }} aria-hidden="true" />
                </button>
              </ParchmentCard>
            ))}
          </div>

          {/* Detail pane */}
          <div className="hidden lg:block">
            {detail ? (
              <ParchmentCard delay={0} className="sticky top-8">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="relative w-32 h-32 mb-3">
                    <div className="absolute inset-0 rounded-full blur-2xl opacity-30" style={{ backgroundColor: detail.color }} />
                    <img src={detail.image} alt="" className="relative w-full h-full object-contain" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground">{detail.name}</h3>
                  <p className="text-sm text-muted-foreground font-label">{detail.brand}</p>
                  <WaxSealBadge label={detail.status} variant={statusVariant[detail.status]} />
                </div>
                <div className="space-y-3 mt-4">
                  <PropertyBar label="Shimmer" value={detail.shimmer} color={detail.color} />
                  <PropertyBar label="Sheen" value={detail.sheen} color={detail.color} />
                  <PropertyBar label="Shading" value={detail.shading} color={detail.color} />
                  <PropertyBar label="Saturation" value={detail.saturation} color={detail.color} />
                  <PropertyBar label="Dry Time" value={detail.dryTime} color="hsl(var(--candlelight-dim))" />
                  <PropertyBar label="Water Resistance" value={detail.waterResist} color="hsl(var(--ink-teal))" />
                </div>
              </ParchmentCard>
            ) : (
              <ParchmentCard className="text-center py-12">
                <p className="text-muted-foreground font-label italic text-sm">Select an ink to view its properties</p>
              </ParchmentCard>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default InkCodex;
