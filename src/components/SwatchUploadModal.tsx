import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface UploadedSwatch {
  id: string;
  file: File;
  url: string;
  inkName: string;
  paper: string;
  note: string;
}

interface SwatchUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (swatch: UploadedSwatch) => void;
}

const paperOptions = ["Tomoe River 52gsm", "Rhodia 80gsm", "Cosmo Air Light", "Midori MD", "Clairefontaine", "Life L Writing", "Other"];

const SwatchUploadModal = ({ open, onOpenChange, onUpload }: SwatchUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [inkName, setInkName] = useState("");
  const [paper, setPaper] = useState(paperOptions[0]);
  const [note, setNote] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleSubmit = () => {
    if (!file || !inkName.trim()) return;
    onUpload({
      id: crypto.randomUUID(),
      file,
      url: preview,
      inkName: inkName.trim(),
      paper,
      note: note.trim(),
    });
    // Reset
    setFile(null);
    setPreview("");
    setInkName("");
    setNote("");
    onOpenChange(false);
  };

  const clearFile = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-foreground">Upload Swatch Photo</DialogTitle>
        </DialogHeader>

        {/* Drop zone */}
        {!preview ? (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              dragOver ? "border-primary bg-secondary/50" : "border-border hover:border-primary/40"
            }`}
            role="button"
            aria-label="Upload swatch photo — click or drag and drop"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && inputRef.current?.click()}
          >
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-label text-muted-foreground">
              Drag & drop a swatch photo, or <span className="text-primary">browse</span>
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">JPG, PNG, WebP — max 20MB</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden">
            <img src={preview} alt="Swatch preview" className="w-full aspect-square object-cover" />
            <button
              onClick={clearFile}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 flex items-center justify-center text-foreground hover:bg-background transition-colors"
              aria-label="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Fields */}
        <div className="space-y-3 mt-2">
          <div>
            <label className="text-xs font-label text-muted-foreground block mb-1">Ink Name *</label>
            <input
              type="text"
              value={inkName}
              onChange={e => setInkName(e.target.value)}
              placeholder="e.g., Diamine Oxblood"
              className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-foreground text-sm font-label placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="text-xs font-label text-muted-foreground block mb-1">Paper</label>
            <select
              value={paper}
              onChange={e => setPaper(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-foreground text-sm font-label focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              {paperOptions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-label text-muted-foreground block mb-1">Note</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={`"Beautiful sheen pooling…"`}
              className="w-full px-3 py-2 rounded-lg bg-secondary/60 border border-border text-foreground text-sm font-label placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none h-16"
            />
          </div>
        </div>

        <Button onClick={handleSubmit} disabled={!file || !inkName.trim()} className="w-full mt-2">
          <ImageIcon className="w-4 h-4 mr-2" />
          Add to Swatch Book
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export type { UploadedSwatch };
export default SwatchUploadModal;
