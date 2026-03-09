import AppShell from "@/components/AppShell";
import InkVial from "@/components/InkVial";
import ParchmentCard from "@/components/ParchmentCard";
import SwatchCard from "@/components/SwatchCard";
import WaxSealBadge from "@/components/WaxSealBadge";
import heroImg from "@/assets/scriptorium-hero.jpg";
import inkBlue from "@/assets/inkwell-blue.png";
import inkRed from "@/assets/inkwell-red.png";
import inkGreen from "@/assets/inkwell-green.png";
import inkGold from "@/assets/inkwell-gold.png";
import swatch1 from "@/assets/swatch-sample-1.jpg";
import swatch2 from "@/assets/swatch-sample-2.jpg";
import { Droplets, BookOpen, TrendingUp } from "lucide-react";

const recentInks = [
  { image: inkBlue, name: "Kon-peki", brand: "Iroshizuku", color: "#2244aa", tags: ["Shading", "Classic"] },
  { image: inkRed, name: "Oxblood", brand: "Diamine", color: "#8B0000", tags: ["Shading", "Daily"] },
  { image: inkGreen, name: "Tolkien", brand: "Organics Studio", color: "#006400", tags: ["Shimmer", "LE"] },
  { image: inkGold, name: "Caroube de Chypre", brand: "J. Herbin", color: "#DAA520", tags: ["Scented"] },
];

const Index = () => (
  <AppShell>
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
          <InkVial key={ink.name} {...ink} delay={i * 120} />
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
  </AppShell>
);

export default Index;
