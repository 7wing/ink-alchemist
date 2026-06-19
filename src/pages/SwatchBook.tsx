import { useState } from "react";
import { Link } from "react-router-dom";
import SwatchCard from "@/components/SwatchCard";
import SwatchUploadModal, { UploadedSwatch } from "@/components/SwatchUploadModal";
import swatch1 from "@/assets/swatch-sample-1.jpg";
import swatch2 from "@/assets/swatch-sample-2.jpg";
import { Plus, PenTool, Upload } from "lucide-react";

const defaultSwatches = [
  { image: swatch1, inkName: "Oxblood", paper: "Tomoe River 52gsm", note: "Crazy red sheen in pooling areas" },
  { image: swatch2, inkName: "Blue Lightning", paper: "Cosmo Air Light", note: "Gold shimmer everywhere" },
  { image: swatch1, inkName: "Kon-peki", paper: "Rhodia 80gsm", note: "Perfect daily blue, great shading" },
  { image: swatch2, inkName: "Nitrogen", paper: "Tomoe River 52gsm", note: "Most insane sheen I've ever seen" },
  { image: swatch1, inkName: "Apache Sunset", paper: "Midori MD", note: "Incredible orange-to-yellow shading" },
  { image: swatch2, inkName: "Vinta Julio", paper: "Cosmo Air Light", note: "Subtle gold shimmer, lovely teal" },
];

const SwatchBook = () => {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploaded, setUploaded] = useState<UploadedSwatch[]>([]);

  const handleUpload = (swatch: UploadedSwatch) => {
    setUploaded(prev => [swatch, ...prev]);
  };

  return (
    <>
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
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-label text-sm hover:opacity-90 transition-opacity"
              aria-label="Upload a swatch photo"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Photo</span>
            </button>
          </div>
        </div>

        {/* Uploaded swatches */}
        {uploaded.length > 0 && (
          <div className="mb-8">
            <h3 className="font-display text-lg text-foreground mb-3 flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" /> Recently Added
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {uploaded.map((s, i) => (
                <SwatchCard
                  key={s.id}
                  image={s.url}
                  inkName={s.inkName}
                  paper={s.paper}
                  note={s.note || undefined}
                  delay={i * 80}
                />
              ))}
            </div>
          </div>
        )}

        {/* Default swatches */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {defaultSwatches.map((s, i) => (
            <SwatchCard key={`${s.inkName}-${s.paper}`} {...s} delay={i * 80} />
          ))}
        </div>
      </div>

      <SwatchUploadModal open={uploadOpen} onOpenChange={setUploadOpen} onUpload={handleUpload} />
    </>
  );
};

export default SwatchBook;
