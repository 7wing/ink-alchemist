import { useState, useRef, useCallback } from "react";
import AppShell from "@/components/AppShell";
import ParchmentCard from "@/components/ParchmentCard";
import { Button } from "@/components/ui/button";
import { Undo2, Download, Trash2, Droplets, Sparkles } from "lucide-react";
import inkBlue from "@/assets/inkwell-blue.png";
import inkRed from "@/assets/inkwell-red.png";
import inkGreen from "@/assets/inkwell-green.png";
import inkGold from "@/assets/inkwell-gold.png";

const papers = [
  { id: "tomoe", name: "Tomoe River 52gsm", texture: "smooth", sheenBonus: 1.5 },
  { id: "rhodia", name: "Rhodia 80gsm", texture: "vellum", sheenBonus: 1.0 },
  { id: "cosmo", name: "Cosmo Air Light", texture: "silky", sheenBonus: 1.3 },
  { id: "midori", name: "Midori MD", texture: "toothy", sheenBonus: 0.8 },
];

const inks = [
  { id: 1, name: "Kon-peki", brand: "Iroshizuku", color: "#2244aa", sheen: "#cc2255", shimmer: false, image: inkBlue },
  { id: 2, name: "Oxblood", brand: "Diamine", color: "#6B1010", sheen: "#44aa88", shimmer: false, image: inkRed },
  { id: 3, name: "Nitrogen", brand: "Organics Studio", color: "#1a5555", sheen: "#ff4488", shimmer: true, image: inkGreen },
  { id: 4, name: "Emerald of Chivor", brand: "J. Herbin", color: "#006D55", sheen: "#cc3366", shimmer: true, image: inkGold },
];

interface Stroke {
  points: { x: number; y: number; pressure: number }[];
  inkId: number;
  paperId: string;
}

const SwatchBuilder = () => {
  const [selectedInk, setSelectedInk] = useState(inks[0]);
  const [selectedPaper, setSelectedPaper] = useState(papers[0]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [note, setNote] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const getCoords = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    const coords = getCoords(e);
    setCurrentStroke({
      points: [{ ...coords, pressure: 0.5 }],
      inkId: selectedInk.id,
      paperId: selectedPaper.id,
    });
  }, [getCoords, selectedInk.id, selectedPaper.id]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || !currentStroke) return;
    e.preventDefault();
    const coords = getCoords(e);
    const pressure = "touches" in e && e.touches[0] ? (e.touches[0] as unknown as { force?: number }).force || 0.5 : 0.5;
    
    setCurrentStroke(prev => prev ? {
      ...prev,
      points: [...prev.points, { ...coords, pressure: Math.max(0.2, Math.min(1, pressure)) }],
    } : null);
  }, [getCoords, currentStroke]);

  const stopDrawing = useCallback(() => {
    if (currentStroke && currentStroke.points.length > 1) {
      setStrokes(prev => [...prev, currentStroke]);
    }
    setCurrentStroke(null);
    isDrawing.current = false;
  }, [currentStroke]);

  const renderStrokes = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Paper background
    ctx.fillStyle = "#FDF6E3";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add paper texture
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < 200; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? "#000" : "#8B7355";
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
    }
    ctx.globalAlpha = 1;

    const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes;

    allStrokes.forEach(stroke => {
      const ink = inks.find(i => i.id === stroke.inkId) || selectedInk;
      const paper = papers.find(p => p.id === stroke.paperId) || selectedPaper;
      
      if (stroke.points.length < 2) return;

      // Main ink stroke
      ctx.beginPath();
      ctx.strokeStyle = ink.color;
      ctx.lineWidth = 12;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 0.85;

      stroke.points.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          const prev = stroke.points[i - 1];
          const midX = (prev.x + point.x) / 2;
          const midY = (prev.y + point.y) / 2;
          ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
        }
      });
      ctx.stroke();

      // Sheen effect (edges)
      if (paper.sheenBonus > 0.5) {
        ctx.beginPath();
        ctx.strokeStyle = ink.sheen;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.3 * paper.sheenBonus;
        
        stroke.points.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x - 5, point.y - 5);
          } else {
            const prev = stroke.points[i - 1];
            ctx.lineTo(point.x - 5, point.y - 5);
          }
        });
        ctx.stroke();
      }

      // Shimmer particles
      if (ink.shimmer) {
        ctx.globalAlpha = 0.6;
        stroke.points.forEach((point, i) => {
          if (i % 3 === 0) {
            const offsetX = (Math.random() - 0.5) * 10;
            const offsetY = (Math.random() - 0.5) * 10;
            ctx.fillStyle = "#FFD700";
            ctx.beginPath();
            ctx.arc(point.x + offsetX, point.y + offsetY, 0.8, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      ctx.globalAlpha = 1;
    });
  }, [strokes, currentStroke, selectedInk, selectedPaper]);

  // Render on changes
  useState(() => {
    renderStrokes();
  });

  // Effect to render
  const rafRef = useRef<number>();
  if (rafRef.current) cancelAnimationFrame(rafRef.current);
  rafRef.current = requestAnimationFrame(renderStrokes);

  const undo = () => setStrokes(prev => prev.slice(0, -1));
  const clear = () => setStrokes([]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `swatch-${selectedInk.name.toLowerCase().replace(/\s/g, "-")}-${selectedPaper.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-12">
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">Swatch Card Builder</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas area */}
          <div className="lg:col-span-2">
            <ParchmentCard className="p-0 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                className="w-full aspect-[3/2] cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                aria-label="Swatch drawing canvas"
              />
            </ParchmentCard>

            {/* Controls */}
            <div className="flex items-center gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={undo} disabled={strokes.length === 0}>
                <Undo2 className="w-4 h-4 mr-1" /> Undo
              </Button>
              <Button variant="outline" size="sm" onClick={clear} disabled={strokes.length === 0}>
                <Trash2 className="w-4 h-4 mr-1" /> Clear
              </Button>
              <Button variant="default" size="sm" onClick={download} className="ml-auto">
                <Download className="w-4 h-4 mr-1" /> Save PNG
              </Button>
            </div>

            {/* Notes */}
            <div className="mt-4">
              <label className="text-sm font-label text-muted-foreground block mb-1">Handwritten note</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g., &quot;Crazy red sheen on Tomoe River!&quot;"
                className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-foreground text-sm font-label placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none h-20"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Ink selector */}
            <ParchmentCard>
              <h3 className="font-display text-lg text-foreground mb-3 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary" /> Select Ink
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {inks.map(ink => (
                  <button
                    key={ink.id}
                    onClick={() => setSelectedInk(ink)}
                    className={`flex flex-col items-center p-3 rounded-lg border transition-colors ${
                      selectedInk.id === ink.id
                        ? "border-primary bg-secondary"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <img src={ink.image} alt="" className="w-10 h-10 object-contain mb-1" />
                    <span className="text-xs font-label text-foreground truncate w-full text-center">{ink.name}</span>
                    <span className="text-[10px] text-muted-foreground">{ink.brand}</span>
                    {ink.shimmer && (
                      <Sparkles className="w-3 h-3 text-candlelight mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </ParchmentCard>

            {/* Paper selector */}
            <ParchmentCard>
              <h3 className="font-display text-lg text-foreground mb-3">Paper Type</h3>
              <div className="space-y-2">
                {papers.map(paper => (
                  <button
                    key={paper.id}
                    onClick={() => setSelectedPaper(paper)}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                      selectedPaper.id === paper.id
                        ? "border-primary bg-secondary"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <span className="text-sm font-label text-foreground">{paper.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-2">
                      {paper.sheenBonus > 1 ? "High sheen" : paper.sheenBonus < 1 ? "Low sheen" : "Medium sheen"}
                    </span>
                  </button>
                ))}
              </div>
            </ParchmentCard>

            {/* Preview info */}
            <ParchmentCard>
              <h3 className="font-display text-lg text-foreground mb-2">Current Swatch</h3>
              <div className="text-sm font-label text-muted-foreground space-y-1">
                <p><span className="text-foreground">{selectedInk.name}</span> by {selectedInk.brand}</p>
                <p>on <span className="text-foreground">{selectedPaper.name}</span></p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedInk.color }} />
                  <span className="text-xs">Base</span>
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedInk.sheen }} />
                  <span className="text-xs">Sheen</span>
                  {selectedInk.shimmer && (
                    <>
                      <Sparkles className="w-4 h-4 text-candlelight" />
                      <span className="text-xs">Shimmer</span>
                    </>
                  )}
                </div>
              </div>
            </ParchmentCard>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default SwatchBuilder;
