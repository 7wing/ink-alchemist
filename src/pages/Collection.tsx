import ParchmentCard from "@/components/ParchmentCard";
import WaxSealBadge from "@/components/WaxSealBadge";
import inkBlue from "@/assets/inkwell-blue.png";
import inkRed from "@/assets/inkwell-red.png";
import inkGreen from "@/assets/inkwell-green.png";
import inkGold from "@/assets/inkwell-gold.png";
import { Plus } from "lucide-react";

const collection = [
  { image: inkBlue, name: "Kon-peki", brand: "Iroshizuku", acquired: "2024-12-15", source: "Goulet Pens", fill: 72, size: "50ml", color: "#2244aa" },
  { image: inkRed, name: "Oxblood", brand: "Diamine", acquired: "2025-01-03", source: "Cult Pens", fill: 45, size: "80ml", color: "#8B0000" },
  { image: inkGreen, name: "Nitrogen", brand: "Organics Studio", acquired: "2024-11-20", source: "Vanness Pens", fill: 88, size: "55ml", color: "#006D77" },
  { image: inkGold, name: "Caroube de Chypre", brand: "J. Herbin", acquired: "2025-02-14", source: "Pen Chalet", fill: 95, size: "50ml", color: "#DAA520" },
];

const Collection = () => (
  <div className="max-w-5xl mx-auto px-4 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-3xl md:text-4xl text-foreground">My Collection</h2>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-label text-sm hover:opacity-90 transition-opacity"
          aria-label="Add new ink to collection"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Ink</span>
        </button>
      </div>

      <div className="space-y-4">
        {collection.map((ink, i) => (
          <ParchmentCard key={ink.name} delay={i * 100}>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <div className="absolute inset-0 rounded-full blur-xl opacity-20" style={{ backgroundColor: ink.color }} />
                <img src={ink.image} alt={`${ink.name} bottle`} className="relative w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg font-semibold text-foreground">{ink.name}</h3>
                <p className="text-xs text-muted-foreground font-label">{ink.brand} · {ink.size}</p>
                <p className="text-xs text-muted-foreground font-label mt-0.5">
                  Acquired {new Date(ink.acquired).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {ink.source}
                </p>
                {/* Fill level */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden max-w-[160px]">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${ink.fill}%`, backgroundColor: ink.color }}
                    />
                  </div>
                  <span className="text-[10px] font-label text-muted-foreground">{ink.fill}% full</span>
                </div>
              </div>
              <WaxSealBadge label="Owned" />
            </div>
          </ParchmentCard>
        ))}
      </div>
    </div>
);

export default Collection;
