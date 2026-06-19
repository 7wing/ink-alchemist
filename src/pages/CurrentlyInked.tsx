import { useState } from "react";
import { Link } from "react-router-dom";
import ParchmentCard from "@/components/ParchmentCard";
import LightingBadge from "@/components/LightingBadge";
import MetadataTag from "@/components/MetadataTag";
import ReactionButton from "@/components/ReactionButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/sonner";

type LightingType = "Natural Sunlight" | "Warm Lamp" | "Scanner";

interface Reaction {
  label: string;
  count: number;
  active: boolean;
  icon: React.ReactNode;
}

interface MetadataItem {
  type: "ink" | "paper" | "pen";
  name: string;
  href?: string;
}

interface FeedPost {
  id: string;
  username: string;
  timeAgo: string;
  caption: string;
  imageColor: string;
  lighting: LightingType;
  metadata: MetadataItem[];
  reactions: Reaction[];
}

const INITIAL_POSTS: FeedPost[] = [
  {
    id: "p1",
    username: "inkwell_wanderer",
    timeAgo: "2h ago",
    caption:
      "Finally testing my new Sailor Manyo Haha on Tomoe River. The shading is absolutely out of this world on this paper.",
    imageColor: "#5b8c85",
    lighting: "Natural Sunlight",
    metadata: [
      { type: "ink", name: "Sailor Manyo Haha", href: "/codex/sailor-manyo-haha" },
      { type: "paper", name: "Tomoe River 68gsm" },
      { type: "pen", name: "Pilot Custom 823" },
    ],
    reactions: [
      { label: "Ink Splat", count: 14, active: false, icon: <span className="text-xs">&#10022;</span> },
      { label: "Sheen Glow", count: 6, active: false, icon: <span className="text-xs">&#10023;</span> },
    ],
  },
  {
    id: "p2",
    username: "nib_nomad",
    timeAgo: "5h ago",
    caption:
      "Late night journaling session with J. Herbin Emeraude de Chivor. The gold shimmer under a warm lamp is mesmerising.",
    imageColor: "#2e8b57",
    lighting: "Warm Lamp",
    metadata: [
      { type: "ink", name: "J. Herbin Emeraude de Chivor", href: "/codex/emeraude-de-chivor" },
      { type: "paper", name: "Rhodia Dot Pad" },
      { type: "pen", name: "Lamy 2000" },
    ],
    reactions: [
      { label: "Ink Splat", count: 22, active: false, icon: <span className="text-xs">&#10022;</span> },
      { label: "Sheen Glow", count: 18, active: false, icon: <span className="text-xs">&#10023;</span> },
    ],
  },
  {
    id: "p3",
    username: "sheen_seeker",
    timeAgo: "8h ago",
    caption:
      "Scanner shot of Organics Studio Nitrogen on Cosmo Air Light. The red sheen is blinding even on the lower gsm.",
    imageColor: "#1a237e",
    lighting: "Scanner",
    metadata: [
      { type: "ink", name: "Organics Studio Nitrogen", href: "/codex/os-nitrogen" },
      { type: "paper", name: "Cosmo Air Light 75gsm" },
      { type: "pen", name: "TWSBI Eco 1.1mm Stub" },
    ],
    reactions: [
      { label: "Ink Splat", count: 31, active: false, icon: <span className="text-xs">&#10022;</span> },
      { label: "Sheen Glow", count: 42, active: false, icon: <span className="text-xs">&#10023;</span> },
    ],
  },
  {
    id: "p4",
    username: "paper_purists",
    timeAgo: "1d ago",
    caption:
      "Testing Diamine Oxblood on cotton paper for a commission piece. Behaviour is surprisingly dry but colour depth is unmatched.",
    imageColor: "#6b0f1a",
    lighting: "Natural Sunlight",
    metadata: [
      { type: "ink", name: "Diamine Oxblood", href: "/codex/diamine-oxblood" },
      { type: "paper", name: "Cotton Resume 100gsm" },
      { type: "pen", name: "Platinum 3776 Century" },
    ],
    reactions: [
      { label: "Ink Splat", count: 9, active: false, icon: <span className="text-xs">&#10022;</span> },
      { label: "Sheen Glow", count: 3, active: false, icon: <span className="text-xs">&#10023;</span> },
    ],
  },
];

const IMAGE_COLOR_OPTIONS = [
  { label: "Teal", value: "#5b8c85" },
  { label: "Green", value: "#2e8b57" },
  { label: "Blue", value: "#1a237e" },
  { label: "Red", value: "#6b0f1a" },
  { label: "Gold", value: "#c75b12" },
  { label: "Purple", value: "#6a1b9a" },
];

const CurrentlyInked = () => {
  const [posts, setPosts] = useState<FeedPost[]>(INITIAL_POSTS);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [lighting, setLighting] = useState<LightingType>("Natural Sunlight");
  const [caption, setCaption] = useState("");
  const [inkTag, setInkTag] = useState("");
  const [paperTag, setPaperTag] = useState("");
  const [penTag, setPenTag] = useState("");
  const [imageColor, setImageColor] = useState("#5b8c85");

  const handleReactionToggle = (
    postId: string,
    reactionLabel: string
  ) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          reactions: post.reactions.map((r) => {
            if (r.label !== reactionLabel) return r;
            const nextActive = !r.active;
            return {
              ...r,
              active: nextActive,
              count: nextActive ? r.count + 1 : r.count - 1,
            };
          }),
        };
      })
    );
  };

  const handleSubmit = () => {
    if (!caption.trim()) {
      toast.error("Please add a caption");
      return;
    }

    const metadata: MetadataItem[] = [];
    if (inkTag.trim()) {
      const slug = inkTag
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      metadata.push({
        type: "ink",
        name: inkTag.trim(),
        href: `/codex/${slug}`,
      });
    }
    if (paperTag.trim()) metadata.push({ type: "paper", name: paperTag.trim() });
    if (penTag.trim()) metadata.push({ type: "pen", name: penTag.trim() });

    const newPost: FeedPost = {
      id: `p-${Date.now()}`,
      username: "You",
      timeAgo: "Just now",
      caption: caption.trim(),
      imageColor,
      lighting,
      metadata,
      reactions: [
        { label: "Ink Splat", count: 0, active: false, icon: <span className="text-xs">&#10022;</span> },
        { label: "Sheen Glow", count: 0, active: false, icon: <span className="text-xs">&#10023;</span> },
      ],
    };

    setPosts((prev) => [newPost, ...prev]);

    // Reset form
    setLighting("Natural Sunlight");
    setCaption("");
    setInkTag("");
    setPaperTag("");
    setPenTag("");
    setImageColor("#5b8c85");
    setDialogOpen(false);
    toast.success("Setup logged!");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-3xl md:text-4xl text-foreground">
            Currently Inked
          </h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4" />
                Log Today's Setup
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display">
                  Log Today's Setup
                </DialogTitle>
                <DialogDescription className="font-label">
                  Share your current pen, ink, and paper combination.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-1.5">
                  <Label htmlFor="lighting" className="font-label">
                    Lighting Type
                  </Label>
                  <Select
                    value={lighting}
                    onValueChange={(val) =>
                      setLighting(val as LightingType)
                    }
                  >
                    <SelectTrigger id="lighting">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Natural Sunlight">
                        Natural Sunlight
                      </SelectItem>
                      <SelectItem value="Warm Lamp">Warm Lamp</SelectItem>
                      <SelectItem value="Scanner">Scanner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="caption" className="font-label">
                    Caption
                  </Label>
                  <Textarea
                    id="caption"
                    placeholder="How does it write today?"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-label">Metadata Tags</Label>
                  <Input
                    placeholder="Ink name"
                    value={inkTag}
                    onChange={(e) => setInkTag(e.target.value)}
                    aria-label="ink tag"
                  />
                  <Input
                    placeholder="Paper name"
                    value={paperTag}
                    onChange={(e) => setPaperTag(e.target.value)}
                    aria-label="paper tag"
                  />
                  <Input
                    placeholder="Pen name"
                    value={penTag}
                    onChange={(e) => setPenTag(e.target.value)}
                    aria-label="pen tag"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-label">Image Colour</Label>
                  <div className="flex flex-wrap gap-2">
                    {IMAGE_COLOR_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setImageColor(opt.value)}
                        className={`w-8 h-8 rounded-full border-2 transition-transform ${
                          imageColor === opt.value
                            ? "border-primary scale-110"
                            : "border-border"
                        }`}
                        style={{ backgroundColor: opt.value }}
                        aria-label={`Select ${opt.label} colour`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>Log Setup</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-sm text-muted-foreground font-label mb-6">
          A feed of daily setups from the community
        </p>

        <div className="space-y-6 max-w-2xl mx-auto">
          {posts.map((post, idx) => (
            <ParchmentCard key={post.id} delay={idx * 100} className="overflow-hidden p-0">
              {/* Image with lighting badge overlay */}
              <div className="relative">
                <div
                  className="w-full aspect-[4/3]"
                  style={{ backgroundColor: post.imageColor }}
                  aria-label={`${post.username} post image`}
                />
                <div className="absolute top-3 right-3">
                  <LightingBadge lighting={post.lighting} />
                </div>
              </div>

              {/* Body */}
              <div className="p-4">
                <p className="text-sm text-muted-foreground font-label mb-2">
                  @{post.username} · {post.timeAgo}
                </p>
                <p className="text-sm text-foreground font-body leading-relaxed">
                  {post.caption}
                </p>

                {/* Metadata tags */}
                {post.metadata.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.metadata.map((meta, mIdx) => (
                      <MetadataTag
                        key={`${meta.type}-${mIdx}`}
                        type={meta.type}
                        name={meta.name}
                        href={meta.href}
                      />
                    ))}
                  </div>
                )}

                {/* Reactions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.reactions.map((reaction) => (
                    <ReactionButton
                      key={reaction.label}
                      icon={reaction.icon}
                      label={reaction.label}
                      count={reaction.count}
                      active={reaction.active}
                      onClick={() =>
                        handleReactionToggle(post.id, reaction.label)
                      }
                    />
                  ))}
                </div>
              </div>
            </ParchmentCard>
          ))}
        </div>
      </div>
  );
};

export default CurrentlyInked;
