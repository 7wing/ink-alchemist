import { useState, useRef, useCallback, useEffect } from "react";
import AppShell from "@/components/AppShell";
import ParchmentCard from "@/components/ParchmentCard";
import { Button } from "@/components/ui/button";
import { Undo2, Download, Trash2, Droplets, Sparkles, Minus, Plus } from "lucide-react";
import inkBlue from "@/assets/inkwell-blue.png";
import inkRed from "@/assets/inkwell-red.png";
import inkGreen from "@/assets/inkwell-green.png";
import inkGold from "@/assets/inkwell-gold.png";

const papers = [
  { id: "tomoe", name: "Tomoe River 52gsm", sheenBonus: 1.6, bleedFactor: 0.3, texture: "ultra-smooth" },
  { id: "rhodia", name: "Rhodia 80gsm", sheenBonus: 1.0, bleedFactor: 0.15, texture: "vellum" },
  { id: "cosmo", name: "Cosmo Air Light", sheenBonus: 1.4, bleedFactor: 0.25, texture: "silky" },
  { id: "midori", name: "Midori MD", sheenBonus: 0.7, bleedFactor: 0.5, texture: "toothy" },
];

const inkOptions = [
  { id: 1, name: "Kon-peki", brand: "Iroshizuku", baseColor: [34, 68, 170], sheenColor: [204, 34, 85], shimmer: false, image: inkBlue, saturation: 0.8 },
  { id: 2, name: "Oxblood", brand: "Diamine", baseColor: [107, 16, 16], sheenColor: [40, 140, 100], shimmer: false, image: inkRed, saturation: 0.9 },
  { id: 3, name: "Nitrogen", brand: "Organics Studio", baseColor: [26, 85, 85], sheenColor: [220, 50, 120], shimmer: true, image: inkGreen, saturation: 0.75 },
  { id: 4, name: "Emerald of Chivor", brand: "J. Herbin", baseColor: [0, 109, 85], sheenColor: [200, 51, 102], shimmer: true, image: inkGold, saturation: 0.7 },
];

interface Point {
  x: number;
  y: number;
  pressure: number;
  timestamp: number;
}

interface Stroke {
  points: Point[];
  inkId: number;
  paperId: string;
  brushSize: number;
}

function hexFromRgb(r: number, g: number, b: number) {
  return `rgb(${r},${g},${b})`;
}

function lerpColor(a: number[], b: number[], t: number) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}

const SwatchBuilder = () => {
  const [selectedInk, setSelectedInk] = useState(inkOptions[0]);
  const [selectedPaper, setSelectedPaper] = useState(papers[0]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [brushSize, setBrushSize] = useState(14);
  const [note, setNote] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const currentPoints = useRef<Point[]>([]);
  const animFrame = useRef<number>(0);

  const getCoords = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, pressure: 0.5 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e && e.touches.length > 0) {
      const touch = e.touches[0];
      const force = (touch as any).force;
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
        pressure: force && force > 0 ? Math.max(0.15, Math.min(1, force)) : 0.5,
      };
    }
    // Mouse: use buttons for simulated pressure variation
    const me = e as React.MouseEvent;
    return {
      x: (me.clientX - rect.left) * scaleX,
      y: (me.clientY - rect.top) * scaleY,
      pressure: me.buttons === 1 ? 0.5 : 0.3,
    };
  }, []);

  // --- Render engine ---
  const renderAll = useCallback((extraPoints?: Point[]) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Paper base
    ctx.fillStyle = "#FDF6E3";
    ctx.fillRect(0, 0, w, h);

    // Paper texture
    const paper = selectedPaper;
    ctx.save();
    ctx.globalAlpha = 0.04;
    const seed = paper.id.charCodeAt(0);
    for (let i = 0; i < 400; i++) {
      const px = ((seed * 17 + i * 31) % w);
      const py = ((seed * 13 + i * 47) % h);
      ctx.fillStyle = i % 3 === 0 ? "#A89070" : "#C4B090";
      ctx.fillRect(px, py, 1 + (i % 2), 1);
    }
    // Horizontal grain for toothy paper
    if (paper.bleedFactor > 0.3) {
      ctx.globalAlpha = 0.02;
      for (let y = 0; y < h; y += 3) {
        ctx.fillStyle = "#8B7355";
        ctx.fillRect(0, y, w, 1);
      }
    }
    ctx.restore();

    // Draw all strokes
    const allStrokes = extraPoints && extraPoints.length > 1
      ? [...strokes, { points: extraPoints, inkId: selectedInk.id, paperId: selectedPaper.id, brushSize }]
      : strokes;

    allStrokes.forEach(stroke => {
      const ink = inkOptions.find(i => i.id === stroke.inkId) || selectedInk;
      const p = papers.find(p => p.id === stroke.paperId) || selectedPaper;
      renderStroke(ctx, stroke, ink, p);
    });
  }, [strokes, selectedInk, selectedPaper, brushSize]);

  function renderStroke(
    ctx: CanvasRenderingContext2D,
    stroke: Stroke,
    ink: typeof inkOptions[0],
    paper: typeof papers[0],
  ) {
    const pts = stroke.points;
    if (pts.length < 2) return;
    const bSize = stroke.brushSize;

    // --- Bleed layer (underlying diffuse glow) ---
    ctx.save();
    ctx.globalAlpha = 0.12 * paper.bleedFactor;
    ctx.filter = `blur(${4 + paper.bleedFactor * 8}px)`;
    ctx.beginPath();
    ctx.strokeStyle = hexFromRgb(...ink.baseColor as [number, number, number]);
    ctx.lineWidth = bSize * 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    drawSmoothPath(ctx, pts, 1);
    ctx.stroke();
    ctx.filter = "none";
    ctx.restore();

    // --- Main ink body ---
    // Draw as series of circles for pressure-variable width
    ctx.save();
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const dist = Math.hypot(curr.x - prev.x, curr.y - prev.y);
      const steps = Math.max(1, Math.floor(dist / 2));

      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const x = prev.x + (curr.x - prev.x) * t;
        const y = prev.y + (curr.y - prev.y) * t;
        const pressure = prev.pressure + (curr.pressure - prev.pressure) * t;
        const radius = (bSize * 0.5) * (0.4 + pressure * 0.8);

        // Slight color variation for natural feel
        const colorShift = Math.sin(i * 0.3 + s * 0.1) * 10;
        const r = Math.min(255, Math.max(0, ink.baseColor[0] + colorShift));
        const g = Math.min(255, Math.max(0, ink.baseColor[1] + colorShift * 0.5));
        const b = Math.min(255, Math.max(0, ink.baseColor[2] - colorShift * 0.3));

        ctx.globalAlpha = 0.65 + pressure * 0.25;
        ctx.fillStyle = hexFromRgb(r, g, b);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // --- Shading (darker edges, lighter center) ---
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = 0.15;
    ctx.beginPath();
    ctx.strokeStyle = hexFromRgb(
      Math.max(0, ink.baseColor[0] - 40),
      Math.max(0, ink.baseColor[1] - 40),
      Math.max(0, ink.baseColor[2] - 40),
    );
    ctx.lineWidth = bSize * 0.8;
    ctx.lineCap = "round";
    drawSmoothPath(ctx, pts, 1);
    ctx.stroke();
    ctx.restore();

    // --- Sheen effect (colored edges where ink pools) ---
    if (paper.sheenBonus > 0.5) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.2 * paper.sheenBonus;
      
      // Draw sheen on edges
      for (let offset = -1; offset <= 1; offset += 2) {
        ctx.beginPath();
        ctx.strokeStyle = hexFromRgb(...ink.sheenColor as [number, number, number]);
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        
        pts.forEach((pt, i) => {
          const pressure = pt.pressure;
          const radius = (bSize * 0.5) * (0.4 + pressure * 0.8);
          const nx = i > 0 ? -(pts[i].y - pts[i-1].y) : 0;
          const ny = i > 0 ? (pts[i].x - pts[i-1].x) : 0;
          const len = Math.hypot(nx, ny) || 1;
          const edgeX = pt.x + (nx / len) * radius * offset;
          const edgeY = pt.y + (ny / len) * radius * offset;
          
          if (i === 0) ctx.moveTo(edgeX, edgeY);
          else ctx.lineTo(edgeX, edgeY);
        });
        ctx.stroke();
      }

      // Extra sheen glow at slow/pool points
      pts.forEach((pt, i) => {
        if (i < 2 || i > pts.length - 3) return;
        const prev = pts[i - 1];
        const speed = Math.hypot(pt.x - prev.x, pt.y - prev.y) / Math.max(1, pt.timestamp - prev.timestamp);
        if (speed < 0.3) {
          ctx.globalAlpha = 0.35 * paper.sheenBonus;
          const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, bSize);
          grad.addColorStop(0, `rgba(${ink.sheenColor.join(",")},0.4)`);
          grad.addColorStop(1, `rgba(${ink.sheenColor.join(",")},0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, bSize, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.restore();
    }

    // --- Shimmer particles ---
    if (ink.shimmer) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      pts.forEach((pt, i) => {
        if (i % 2 !== 0) return;
        const pressure = pt.pressure;
        const radius = (bSize * 0.5) * (0.4 + pressure * 0.8);

        for (let j = 0; j < 3; j++) {
          const angle = ((i * 137.5 + j * 120) * Math.PI) / 180;
          const dist = Math.random() * radius * 0.9;
          const sx = pt.x + Math.cos(angle) * dist;
          const sy = pt.y + Math.sin(angle) * dist;
          const size = 0.5 + Math.random() * 1.2;

          ctx.globalAlpha = 0.3 + Math.random() * 0.5;
          const shimmerColors = ["#FFD700", "#FFF8DC", "#FAFAD2", "#F0E68C"];
          ctx.fillStyle = shimmerColors[j % shimmerColors.length];
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.restore();
    }
  }

  function drawSmoothPath(ctx: CanvasRenderingContext2D, pts: Point[], _tension: number) {
    if (pts.length < 2) return;
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const mx = (prev.x + curr.x) / 2;
      const my = (prev.y + curr.y) / 2;
      ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
    }
    const last = pts[pts.length - 1];
    ctx.lineTo(last.x, last.y);
  }

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    const { x, y, pressure } = getCoords(e);
    currentPoints.current = [{ x, y, pressure, timestamp: Date.now() }];
  }, [getCoords]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const { x, y, pressure } = getCoords(e);
    currentPoints.current.push({ x, y, pressure, timestamp: Date.now() });

    cancelAnimationFrame(animFrame.current);
    animFrame.current = requestAnimationFrame(() => renderAll(currentPoints.current));
  }, [getCoords, renderAll]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    if (currentPoints.current.length > 1) {
      setStrokes(prev => [...prev, {
        points: [...currentPoints.current],
        inkId: selectedInk.id,
        paperId: selectedPaper.id,
        brushSize,
      }]);
    }
    currentPoints.current = [];
  }, [selectedInk.id, selectedPaper.id, brushSize]);

  useEffect(() => {
    renderAll();
  }, [renderAll]);

  const undo = () => setStrokes(prev => prev.slice(0, -1));
  const clear = () => setStrokes([]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Add note overlay
    if (note.trim()) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.save();
        ctx.font = "italic 14px 'Crimson Text', serif";
        ctx.fillStyle = "rgba(139,115,85,0.7)";
        ctx.fillText(`"${note}"`, 20, canvas.height - 20);
        ctx.restore();
      }
    }
    const link = document.createElement("a");
    link.download = `swatch-${selectedInk.name.toLowerCase().replace(/\s/g, "-")}-${selectedPaper.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    // Re-render to remove text overlay
    renderAll();
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-12">
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">Swatch Card Builder</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-2">
            <ParchmentCard className="p-0 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={720}
                height={480}
                className="w-full aspect-[3/2] cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                aria-label="Swatch drawing canvas — draw ink strokes here"
              />
            </ParchmentCard>

            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <Button variant="outline" size="sm" onClick={undo} disabled={strokes.length === 0}>
                <Undo2 className="w-4 h-4 mr-1" /> Undo
              </Button>
              <Button variant="outline" size="sm" onClick={clear} disabled={strokes.length === 0}>
                <Trash2 className="w-4 h-4 mr-1" /> Clear
              </Button>

              {/* Brush size */}
              <div className="flex items-center gap-1 ml-4 border border-border rounded-lg px-2 py-1">
                <button onClick={() => setBrushSize(s => Math.max(4, s - 2))} className="text-muted-foreground hover:text-foreground p-1" aria-label="Decrease brush size">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-xs font-label text-foreground w-6 text-center">{brushSize}</span>
                <button onClick={() => setBrushSize(s => Math.min(40, s + 2))} className="text-muted-foreground hover:text-foreground p-1" aria-label="Increase brush size">
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <Button variant="default" size="sm" onClick={download} className="ml-auto">
                <Download className="w-4 h-4 mr-1" /> Save PNG
              </Button>
            </div>

            <div className="mt-4">
              <label className="text-sm font-label text-muted-foreground block mb-1">Handwritten note</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder={`e.g., "Crazy red sheen on Tomoe River!"`}
                className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-foreground text-sm font-label placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none h-20"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <ParchmentCard>
              <h3 className="font-display text-lg text-foreground mb-3 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary" /> Select Ink
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {inkOptions.map(ink => (
                  <button
                    key={ink.id}
                    onClick={() => setSelectedInk(ink)}
                    className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                      selectedInk.id === ink.id
                        ? "border-primary bg-secondary shadow-candle"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <img src={ink.image} alt="" className="w-10 h-10 object-contain mb-1" />
                    <span className="text-xs font-label text-foreground truncate w-full text-center">{ink.name}</span>
                    <span className="text-[10px] text-muted-foreground">{ink.brand}</span>
                    {ink.shimmer && <Sparkles className="w-3 h-3 text-candlelight mt-1" />}
                  </button>
                ))}
              </div>
            </ParchmentCard>

            <ParchmentCard>
              <h3 className="font-display text-lg text-foreground mb-3">Paper Type</h3>
              <div className="space-y-2">
                {papers.map(paper => (
                  <button
                    key={paper.id}
                    onClick={() => setSelectedPaper(paper)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${
                      selectedPaper.id === paper.id
                        ? "border-primary bg-secondary shadow-candle"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-label text-foreground">{paper.name}</span>
                      <span className="text-[10px] text-muted-foreground">{paper.texture}</span>
                    </div>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[10px] text-antique-gold">
                        Sheen: {paper.sheenBonus > 1.2 ? "★★★" : paper.sheenBonus > 0.8 ? "★★" : "★"}
                      </span>
                      <span className="text-[10px] text-ink-teal">
                        Bleed: {paper.bleedFactor > 0.3 ? "High" : paper.bleedFactor > 0.2 ? "Med" : "Low"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </ParchmentCard>

            <ParchmentCard>
              <h3 className="font-display text-lg text-foreground mb-2">Current Setup</h3>
              <div className="text-sm font-label text-muted-foreground space-y-1.5">
                <p><span className="text-foreground">{selectedInk.name}</span> by {selectedInk.brand}</p>
                <p>on <span className="text-foreground">{selectedPaper.name}</span></p>
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: hexFromRgb(...selectedInk.baseColor as [number,number,number]) }} />
                    <span className="text-[10px]">Base</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: hexFromRgb(...selectedInk.sheenColor as [number,number,number]) }} />
                    <span className="text-[10px]">Sheen</span>
                  </div>
                  {selectedInk.shimmer && (
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-candlelight" />
                      <span className="text-[10px]">Shimmer</span>
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Brush: {brushSize}px · Strokes: {strokes.length}
                </p>
              </div>
            </ParchmentCard>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default SwatchBuilder;
