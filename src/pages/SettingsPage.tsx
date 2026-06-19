import ParchmentCard from "@/components/ParchmentCard";
import { Download, Eye, Bell, Shield } from "lucide-react";

const SettingsPage = () => (
  <div className="max-w-2xl mx-auto px-4 pt-8">
      <h2 className="font-display text-3xl md:text-4xl text-foreground mb-8">Candle Nook</h2>

      <div className="space-y-4">
        <ParchmentCard delay={0}>
          <div className="flex items-center gap-3 mb-3">
            <Bell className="w-4 h-4 text-primary" />
            <h3 className="font-display text-lg text-foreground">Notifications</h3>
          </div>
          <div className="space-y-3">
            {["New ink releases", "Market activity", "Community mentions"].map(label => (
              <label key={label} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm font-label text-muted-foreground">{label}</span>
                <div className="w-10 h-5 bg-secondary rounded-full relative">
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-primary rounded-full transition-transform" />
                </div>
              </label>
            ))}
          </div>
        </ParchmentCard>

        <ParchmentCard delay={100}>
          <div className="flex items-center gap-3 mb-3">
            <Eye className="w-4 h-4 text-primary" />
            <h3 className="font-display text-lg text-foreground">Display</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-label text-muted-foreground">Animation intensity</span>
              <select className="bg-secondary text-foreground text-sm font-label rounded px-2 py-1 border border-border">
                <option>Full</option>
                <option>Reduced</option>
                <option>None</option>
              </select>
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm font-label text-muted-foreground">Theme</span>
              <span className="text-sm font-label text-antique-gold">Candlelit (always)</span>
            </label>
          </div>
        </ParchmentCard>

        <ParchmentCard delay={200}>
          <div className="flex items-center gap-3 mb-3">
            <Download className="w-4 h-4 text-primary" />
            <h3 className="font-display text-lg text-foreground">Export</h3>
          </div>
          <button className="w-full text-left text-sm font-label text-muted-foreground hover:text-primary transition-colors py-2">
            Export collection as "Ink Grimoire" PDF →
          </button>
          <button className="w-full text-left text-sm font-label text-muted-foreground hover:text-primary transition-colors py-2">
            Generate shareable link (watermarked) →
          </button>
        </ParchmentCard>

        <ParchmentCard delay={300}>
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-4 h-4 text-primary" />
            <h3 className="font-display text-lg text-foreground">Privacy</h3>
          </div>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-label text-muted-foreground">Anonymous sharing</span>
            <div className="w-10 h-5 bg-secondary rounded-full relative">
              <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-muted-foreground rounded-full transition-transform" />
            </div>
          </label>
        </ParchmentCard>
      </div>
    </div>
);

export default SettingsPage;
