import { useState } from "react";
import InkVial from "@/components/InkVial";
import ParchmentCard from "@/components/ParchmentCard";
import SwatchCard from "@/components/SwatchCard";
import WaxSealBadge from "@/components/WaxSealBadge";
import InkDetailModal, { InkData } from "@/components/InkDetailModal";
import heroImg from "@/assets/scriptorium-hero.jpg";
import inkBlue from "@/assets/inkwell-blue.png";
import inkRed from "@/assets/inkwell-red.png";
import inkGreen from "@/assets/inkwell-green.png";
import inkGold from "@/assets/inkwell-gold.png";
import swatch1 from "@/assets/swatch-sample-1.jpg";
import swatch2 from "@/assets/swatch-sample-2.jpg";
import { Droplets, BookOpen, TrendingUp } from "lucide-react";

const recentInks: InkData[] = [
  { 
    id: 1, image: inkBlue, name: "Kon-peki", brand: "Iroshizuku", series: "Iroshizuku", 
    color: "#2244aa", status: "current", shimmer: 0, sheen: 30, shading: 85, saturation: 70, 
    dryTime: 25, waterResist: 15, acquired: "2024-12-15", source: "Goulet Pens", 
    fill: 72, size: "50ml", notes: "Perfect everyday blue with amazing shading" 
  },
  { 
    id: 2, image: inkRed, name: "Oxblood", brand: "Diamine", series: "Standard", 
    color: "#8B0000", status: "current", shimmer: 0, sheen: 45, shading: 90, saturation: 80, 
    dryTime: 30, waterResist: 20, acquired: "2025-01-03", source: "Cult Pens", 
    fill: 45, size: "80ml", notes: "Rich burgundy with green sheen in pooling" 
  },
  { 
    id: 3, image: inkGreen, name: "Nitrogen", brand: "Organics Studio", series: "Elements", 
    color: "#006D77", status: "limited", shimmer: 90, sheen: 95, shading: 40, saturation: 75, 
    dryTime: 60, waterResist: 10, acquired: "2024-11-20", source: "Vanness Pens", 
    fill: 88, size: "55ml", notes: "Most insane sheen I've ever witnessed" 
  },
  { 
    id: 4, image: inkGold, name: "Caroube de Chypre", brand: "J. Herbin", series: "1670 Anniversary", 
    color: "#DAA520", status: "current", shimmer: 70, sheen: 20, shading: 55, saturation: 60, 
    dryTime: 45, waterResist: 25, scent: "Honey & carob", acquired: "2025-02-14", 
    source: "Pen Chalet", fill: 95, size: "50ml", notes: "Beautiful scented ink with gold shimmer" 
  },
];

const Index = () => {
  const [selectedInk, setSelectedInk] = useState<InkData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleInkClick = (ink: InkData) => {
    setSelectedInk(ink);
    setModalOpen(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover opacity-30" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28">
          <h2
            className="font-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground tracking-wide leading-tight"
            style={{ animation: "fade-up 1s ease-out forwards" }}
          >
            Your <span className="text-primary italic">Scriptorium</span> Awaits
          </h2>
          <p
            className="mt-4 text-muted-foreground font-body text-base md:text-lg max-w-xl"
            style={{ animation: "fade-up 1s ease-out 200ms forwards", opacity: 0 }}
          >
            Catalog, swatch, and revere your ink collection — one precious drop at a time.
          </p>
        </div>
      </section>

      {/* Stats row */}
      <section className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Droplets, label: "Inks Owned", value: "247" },
            { icon: BookOpen, label: "Swatches", value: "1,034" },
            { icon: TrendingUp, label: "Rare Finds", value: "18" },
          ].map(({ icon: Icon, label, value }, i) => (
            <ParchmentCard key={label} delay={i * 100} className="text-center">
              <Icon className="w-5 h-5 mx-auto text-primary mb-1" />
              <p className="font-display text-2xl font-semibold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground font-label">{label}</p>
            </ParchmentCard>
          ))}
        </div>
      </section>

      {/* Recent Acquisitions */}
      <section className="max-w-5xl mx-auto px-4 mt-14">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl md:text-2xl text-foreground">Recent Acquisitions</h3>
          <WaxSealBadge label="This Week" variant="limited" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {recentInks.map((ink, i) => (
            <InkVial
              key={ink.id}
              image={ink.image}
              name={ink.name}
              brand={ink.brand}
              color={ink.color}
              tags={[ink.status === "limited" ? "LE" : ink.shimmer && ink.shimmer > 50 ? "Shimmer" : "Shading"]}
              delay={i * 120}
              onClick={() => handleInkClick(ink)}
            />
          ))}
        </div>
      </section>

      {/* Latest Swatches */}
      <section className="max-w-5xl mx-auto px-4 mt-14 mb-10">
        <h3 className="font-display text-xl md:text-2xl text-foreground mb-6">Latest Swatches</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <SwatchCard image={swatch1} inkName="Oxblood" paper="Tomoe River" note="Crazy red sheen in pooling areas" delay={0} />
          <SwatchCard image={swatch2} inkName="Blue Lightning" paper="Cosmo Air Light" note="Gold shimmer everywhere" delay={100} />
          <SwatchCard image={swatch1} inkName="Kon-peki" paper="Rhodia" note="Perfect daily blue" delay={200} />
          <SwatchCard image={swatch2} inkName="Nitrogen" paper="Tomoe River" note="Most insane sheen ever" delay={300} />
        </div>
      </section>

      <InkDetailModal ink={selectedInk} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};

export default Index;
