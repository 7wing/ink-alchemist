import AppShell from "@/components/AppShell";
import ParchmentCard from "@/components/ParchmentCard";
import WaxSealBadge from "@/components/WaxSealBadge";
import inkBlue from "@/assets/inkwell-blue.png";
import inkGreen from "@/assets/inkwell-green.png";
import { Lock } from "lucide-react";

const listings = [
  { image: inkBlue, name: "Sailor Yama-dori", seller: "QuillMaster42", price: "$8.50", size: "3ml sample", status: "discontinued" as const },
  { image: inkGreen, name: "Organics Studio Nitrogen", seller: "InkAlchemist", price: "$12.00", size: "5ml vial", status: "limited" as const },
  { image: inkBlue, name: "Iroshizuku Tsuki-yo", seller: "PenCollector9", price: "$6.00", size: "2ml sample", status: "current" as const },
];

const MarketAlcove = () => (
  <AppShell>
    <div className="max-w-5xl mx-auto px-4 pt-8">
      <div className="flex items-center gap-3 mb-2">
        <h2 className="font-display text-3xl md:text-4xl text-foreground">Market Alcove</h2>
        <Lock className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground font-label mb-8">Invite-only trading post for verified collectors</p>

      <div className="space-y-4">
        {listings.map((item, i) => (
          <ParchmentCard key={item.name + item.seller} delay={i * 100} className="hover:border-primary/20 transition-colors">
            <div className="flex items-center gap-4">
              <img src={item.image} alt="" className="w-14 h-14 object-contain flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display text-base font-semibold text-foreground">{item.name}</h3>
                  <WaxSealBadge label={item.status} variant={item.status === "current" ? "default" : item.status} />
                </div>
                <p className="text-xs text-muted-foreground font-label">{item.size} · by {item.seller}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-display text-lg text-primary font-semibold">{item.price}</p>
                <button className="text-[10px] font-label text-antique-gold hover:text-primary transition-colors">Request</button>
              </div>
            </div>
          </ParchmentCard>
        ))}
      </div>
    </div>
  </AppShell>
);

export default MarketAlcove;
