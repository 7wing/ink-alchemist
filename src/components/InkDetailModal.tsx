import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PropertyBar from "./PropertyBar";
import WaxSealBadge from "./WaxSealBadge";
import SwatchCard from "./SwatchCard";
import swatch1 from "@/assets/swatch-sample-1.jpg";
import swatch2 from "@/assets/swatch-sample-2.jpg";
import { Calendar, MapPin, Droplets } from "lucide-react";

export interface InkData {
  id: number;
  image: string;
  name: string;
  brand: string;
  series?: string;
  color: string;
  status?: "current" | "limited" | "discontinued";
  shimmer?: number;
  sheen?: number;
  shading?: number;
  saturation?: number;
  dryTime?: number;
  waterResist?: number;
  scent?: string;
  acquired?: string;
  source?: string;
  fill?: number;
  size?: string;
  notes?: string;
}

interface InkDetailModalProps {
  ink: InkData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusVariant = { current: "default" as const, limited: "limited" as const, discontinued: "discontinued" as const };

const InkDetailModal = ({ ink, open, onOpenChange }: InkDetailModalProps) => {
  if (!ink) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="sr-only">{ink.name} Details</DialogTitle>
        </DialogHeader>

        {/* Header with vial */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border">
          <div className="relative w-32 h-32 flex-shrink-0">
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-40"
              style={{ backgroundColor: ink.color }}
            />
            <img
              src={ink.image}
              alt={`${ink.name} ink bottle`}
              className="relative w-full h-full object-contain animate-gentle-float"
            />
          </div>
          <div className="text-center sm:text-left flex-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <h2 className="font-display text-2xl font-semibold text-foreground">{ink.name}</h2>
              {ink.status && (
                <WaxSealBadge label={ink.status} variant={statusVariant[ink.status]} />
              )}
            </div>
            <p className="text-sm text-muted-foreground font-label mt-1">
              {ink.brand} {ink.series && `· ${ink.series}`}
            </p>
            {ink.scent && (
              <p className="text-xs text-antique-gold font-label italic mt-2">
                Scent note: {ink.scent}
              </p>
            )}
            <div
              className="mt-3 w-8 h-8 rounded-full border-2 border-border mx-auto sm:mx-0"
              style={{ backgroundColor: ink.color }}
              aria-label={`Color swatch: ${ink.color}`}
            />
          </div>
        </div>

        {/* Properties Grid */}
        <div className="py-6 border-b border-border">
          <h3 className="font-display text-lg text-foreground mb-4">Ink Properties</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <PropertyBar label="Shimmer" value={ink.shimmer ?? 0} color={ink.color} />
            <PropertyBar label="Sheen" value={ink.sheen ?? 0} color={ink.color} />
            <PropertyBar label="Shading" value={ink.shading ?? 0} color={ink.color} />
            <PropertyBar label="Saturation" value={ink.saturation ?? 0} color={ink.color} />
            <PropertyBar label="Dry Time" value={ink.dryTime ?? 0} color="hsl(var(--candlelight-dim))" />
            <PropertyBar label="Water Resistance" value={ink.waterResist ?? 0} color="hsl(var(--ink-teal))" />
          </div>
        </div>

        {/* Acquisition History */}
        {(ink.acquired || ink.source || ink.fill !== undefined) && (
          <div className="py-6 border-b border-border">
            <h3 className="font-display text-lg text-foreground mb-4">Acquisition History</h3>
            <div className="space-y-3">
              {ink.acquired && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground font-label">
                    Acquired {new Date(ink.acquired).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              )}
              {ink.source && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground font-label">{ink.source}</span>
                </div>
              )}
              {ink.size && (
                <div className="flex items-center gap-3 text-sm">
                  <Droplets className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground font-label">{ink.size}</span>
                </div>
              )}
              {ink.fill !== undefined && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs font-label text-muted-foreground mb-1">
                    <span>Fill Level</span>
                    <span>{ink.fill}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${ink.fill}%`, backgroundColor: ink.color }}
                    />
                  </div>
                </div>
              )}
            </div>
            {ink.notes && (
              <p className="mt-4 text-sm text-antique-gold font-label italic border-l-2 border-primary/30 pl-3">
                "{ink.notes}"
              </p>
            )}
          </div>
        )}

        {/* Swatches */}
        <div className="py-6">
          <h3 className="font-display text-lg text-foreground mb-4">Swatch Photos</h3>
          <div className="grid grid-cols-2 gap-3">
            <SwatchCard image={swatch1} inkName={ink.name} paper="Tomoe River 52gsm" note="Beautiful sheen pooling" />
            <SwatchCard image={swatch2} inkName={ink.name} paper="Cosmo Air Light" note="Shimmer under warm light" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InkDetailModal;
