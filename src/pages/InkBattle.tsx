import { useState, useMemo } from "react";
import ParchmentCard from "@/components/ParchmentCard";
import PropertyBar from "@/components/PropertyBar";
import VoteBar from "@/components/VoteBar";
import SimilarityBadge from "@/components/SimilarityBadge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import inkBlue from "@/assets/inkwell-blue.png";
import inkRed from "@/assets/inkwell-red.png";
import inkGreen from "@/assets/inkwell-green.png";
import inkGold from "@/assets/inkwell-gold.png";

interface InkProperties {
  sheen: number;
  shading: number;
  shimmer: number;
  saturation: number;
}

interface Ink {
  id: string;
  name: string;
  brand: string;
  hex: string;
  family: string;
  image: string;
  properties: InkProperties;
}

interface CommunityBattle {
  id: string;
  leftInk: Ink;
  rightInk: Ink;
  leftVotes: number;
  rightVotes: number;
  comment: string;
  commentAuthor: string;
}

const MOCK_INKS: Ink[] = [
  {
    id: "i1",
    name: "Diamine Oxblood",
    brand: "Diamine",
    hex: "#6b0f1a",
    family: "red",
    image: inkRed,
    properties: { sheen: 15, shading: 75, shimmer: 0, saturation: 92 },
  },
  {
    id: "i2",
    name: "Noodler's Apache Sunset",
    brand: "Noodler's",
    hex: "#c75b12",
    family: "orange",
    image: inkGold,
    properties: { sheen: 10, shading: 95, shimmer: 0, saturation: 88 },
  },
  {
    id: "i3",
    name: "Sailor Manyo Haha",
    brand: "Sailor",
    hex: "#5b8c85",
    family: "teal",
    image: inkGreen,
    properties: { sheen: 35, shading: 60, shimmer: 45, saturation: 70 },
  },
  {
    id: "i4",
    name: "Pilot Iroshizuku Kon-peki",
    brand: "Pilot",
    hex: "#0066cc",
    family: "blue",
    image: inkBlue,
    properties: { sheen: 20, shading: 55, shimmer: 0, saturation: 85 },
  },
  {
    id: "i5",
    name: "Organics Studio Nitrogen",
    brand: "Organics Studio",
    hex: "#1a237e",
    family: "blue",
    image: inkBlue,
    properties: { sheen: 98, shading: 40, shimmer: 0, saturation: 90 },
  },
  {
    id: "i6",
    name: "J. Herbin Emeraude de Chivor",
    brand: "J. Herbin",
    hex: "#2e8b57",
    family: "green",
    image: inkGreen,
    properties: { sheen: 60, shading: 50, shimmer: 90, saturation: 80 },
  },
  {
    id: "i7",
    name: "Robert Oster Sedona Red",
    brand: "Robert Oster",
    hex: "#a23b3b",
    family: "red",
    image: inkRed,
    properties: { sheen: 25, shading: 65, shimmer: 30, saturation: 82 },
  },
  {
    id: "i8",
    name: "Sailor Tokiwa-matsu",
    brand: "Sailor",
    hex: "#2f5d50",
    family: "green",
    image: inkGreen,
    properties: { sheen: 45, shading: 70, shimmer: 10, saturation: 75 },
  },
];

const INITIAL_COMMUNITY_BATTLES: CommunityBattle[] = [
  {
    id: "b1",
    leftInk: MOCK_INKS[0],
    rightInk: MOCK_INKS[1],
    leftVotes: 342,
    rightVotes: 289,
    comment: "Oxblood dries faster, but Apache has that wild shading gradient…",
    commentAuthor: "ShadingSage",
  },
  {
    id: "b2",
    leftInk: MOCK_INKS[3],
    rightInk: MOCK_INKS[4],
    leftVotes: 210,
    rightVotes: 456,
    comment: "Nitrogen sheen is unreal on Tomoe River. Kon-peki can not compete.",
    commentAuthor: "SheenHunter",
  },
  {
    id: "b3",
    leftInk: MOCK_INKS[5],
    rightInk: MOCK_INKS[7],
    leftVotes: 521,
    rightVotes: 198,
    comment: "Emeraude has shimmer for days, but Tokiwa-matsu is the better daily driver.",
    commentAuthor: "DailyScribe",
  },
];

const getPropertyColor = (property: keyof InkProperties): string => {
  const map: Record<string, string> = {
    sheen: "hsl(var(--ink-violet))",
    shading: "hsl(var(--candlelight-dim))",
    shimmer: "hsl(var(--antique-gold))",
    saturation: "hsl(var(--burgundy-light))",
  };
  return map[property] || "hsl(var(--primary))";
};

const computeSimilarity = (inks: Ink[]): number => {
  if (inks.length < 2) return 0;
  let totalScore = 0;
  let comparisons = 0;
  for (let i = 0; i < inks.length; i++) {
    for (let j = i + 1; j < inks.length; j++) {
      const a = inks[i];
      const b = inks[j];
      let score = 0;
      if (a.brand === b.brand) score += 20;
      if (a.family === b.family) score += 30;
      const propKeys: (keyof InkProperties)[] = ["sheen", "shading", "shimmer", "saturation"];
      propKeys.forEach((key) => {
        const diff = Math.abs(a.properties[key] - b.properties[key]);
        score += Math.max(0, 12 - diff / 10);
      });
      totalScore += Math.min(98, Math.round(score));
      comparisons++;
    }
  }
  return comparisons === 0 ? 0 : Math.round(totalScore / comparisons);
};

const InkBattle = () => {
  const [slots, setSlots] = useState<Ink[]>([MOCK_INKS[0], MOCK_INKS[1]]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonVotes, setComparisonVotes] = useState<Record<string, number>>({});
  const [communityBattles, setCommunityBattles] = useState<CommunityBattle[]>(INITIAL_COMMUNITY_BATTLES);

  const similarity = useMemo(() => computeSimilarity(slots), [slots]);

  const cycleInk = (slotIndex: number) => {
    setSlots((prev) => {
      const currentId = prev[slotIndex].id;
      const currentIndex = MOCK_INKS.findIndex((ink) => ink.id === currentId);
      const nextIndex = (currentIndex + 1) % MOCK_INKS.length;
      const next = [...prev];
      next[slotIndex] = MOCK_INKS[nextIndex];
      return next;
    });
  };

  const addSlot = () => {
    if (slots.length >= 3) return;
    setSlots((prev) => [...prev, MOCK_INKS[2]]);
  };

  const removeSlot = () => {
    if (slots.length <= 2) return;
    setSlots((prev) => prev.slice(0, -1));
  };

  const handleComparisonVote = (inkId: string) => {
    setComparisonVotes((prev) => ({
      ...prev,
      [inkId]: (prev[inkId] || 0) + 1,
    }));
    toast.success("Vote recorded");
  };

  const getComparisonWinner = () => {
    let winnerId: string | null = null;
    let maxVotes = -1;
    slots.forEach((ink) => {
      const votes = comparisonVotes[ink.id] || 0;
      if (votes > maxVotes) {
        maxVotes = votes;
        winnerId = ink.id;
      }
    });
    const totalComparisonVotes = Object.values(comparisonVotes).reduce((a, b) => a + b, 0);
    return totalComparisonVotes > 0 ? winnerId : null;
  };

  const handleCommunityVote = (battleId: string, side: "left" | "right") => {
    setCommunityBattles((prev) =>
      prev.map((battle) => {
        if (battle.id !== battleId) return battle;
        return {
          ...battle,
          leftVotes: side === "left" ? battle.leftVotes + 1 : battle.leftVotes,
          rightVotes: side === "right" ? battle.rightVotes + 1 : battle.rightVotes,
        };
      })
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pt-8">
        <h2 className="font-display text-3xl md:text-4xl text-foreground mb-2">
          Ink Battles · Dupe Finder
        </h2>
        <p className="text-sm text-muted-foreground font-label mb-6">
          Compare inks side by side and discover hidden dupes
        </p>

        {/* Comparison Builder */}
        <ParchmentCard className="mb-6">
          <h3 className="font-display text-xl text-foreground mb-4">Comparison Builder</h3>
          <div className="flex flex-wrap gap-4 mb-4">
            {slots.map((ink, idx) => (
              <div
                key={`${ink.id}-${idx}`}
                className="flex items-center gap-3 rounded-md border border-border bg-secondary/40 px-3 py-2"
              >
                <img src={ink.image} alt="" className="w-10 h-10 object-contain flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{ink.name}</p>
                  <p className="text-xs text-muted-foreground font-label">{ink.brand}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => cycleInk(idx)}>
                  Change
                </Button>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setShowComparison(true)}>Compare Side by Side</Button>
            <Button variant="outline" onClick={addSlot} disabled={slots.length >= 3}>
              Add Slot
            </Button>
            <Button variant="outline" onClick={removeSlot} disabled={slots.length <= 2}>
              Remove Slot
            </Button>
          </div>
        </ParchmentCard>

        {/* Side-by-Side Panel */}
        {showComparison && (
          <div
            className="mb-6"
            style={{
              animation: "page-unfold 0.6s ease-out forwards",
            }}
          >
            <div className={`grid gap-4 ${slots.length === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"}`}>
              {slots.map((ink) => {
                const winnerId = getComparisonWinner();
                const isWinner = winnerId === ink.id;
                return (
                  <ParchmentCard key={ink.id} className={`text-center ${isWinner ? "border-primary/40" : ""}`}>
                    <div
                      className="w-24 h-24 mx-auto mb-3 rounded-full flex items-center justify-center"
                      style={{
                        boxShadow: `0 0 24px 4px ${ink.hex}60`,
                        backgroundColor: `${ink.hex}15`,
                      }}
                    >
                      <img src={ink.image} alt="" className="w-16 h-16 object-contain" />
                    </div>
                    <h4 className="font-display text-lg text-foreground">{ink.name}</h4>
                    <p className="text-xs text-muted-foreground font-label mb-3">{ink.brand}</p>
                    <div
                      className="w-full h-8 rounded mb-4"
                      style={{ backgroundColor: ink.hex }}
                    />
                    <div className="space-y-2 mb-4 text-left">
                      {(Object.keys(ink.properties) as (keyof InkProperties)[]).map((key) => (
                        <PropertyBar
                          key={key}
                          label={key.charAt(0).toUpperCase() + key.slice(1)}
                          value={ink.properties[key]}
                          color={getPropertyColor(key)}
                        />
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant={isWinner ? "default" : "outline"}
                      onClick={() => handleComparisonVote(ink.id)}
                      className="w-full"
                    >
                      {isWinner && comparisonVotes[ink.id] ? "Currently Leading" : "Vote Best Performance"}
                    </Button>
                    {comparisonVotes[ink.id] ? (
                      <p className="text-xs text-muted-foreground font-label mt-2">
                        {comparisonVotes[ink.id]} vote{comparisonVotes[ink.id] === 1 ? "" : "s"}
                      </p>
                    ) : null}
                  </ParchmentCard>
                );
              })}
            </div>
          </div>
        )}

        {/* Similarity Score */}
        {showComparison && (
          <ParchmentCard className="mb-6 flex items-center gap-3">
            <SimilarityBadge score={similarity} />
            <span className="text-sm text-muted-foreground font-label">
              {similarity >= 80
                ? "Very high similarity — likely dupes"
                : similarity >= 50
                ? "Moderate similarity — some overlap"
                : "Low similarity — distinct personalities"}
            </span>
          </ParchmentCard>
        )}

        {/* Community Battle cards */}
        <div className="space-y-4 mb-8">
          <h3 className="font-display text-xl text-foreground">Community Battles</h3>
          {communityBattles.map((battle) => (
            <ParchmentCard key={battle.id}>
              <h4 className="font-display text-lg text-foreground mb-3">
                Battle: {battle.leftInk.name} vs {battle.rightInk.name}
              </h4>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      boxShadow: `0 0 12px 2px ${battle.leftInk.hex}50`,
                      backgroundColor: `${battle.leftInk.hex}15`,
                    }}
                  >
                    <img src={battle.leftInk.image} alt="" className="w-6 h-6 object-contain" />
                  </div>
                  <span className="text-xs font-label text-foreground">{battle.leftInk.name}</span>
                </div>
                <span className="text-sm text-muted-foreground font-label">vs</span>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className="text-xs font-label text-foreground">{battle.rightInk.name}</span>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      boxShadow: `0 0 12px 2px ${battle.rightInk.hex}50`,
                      backgroundColor: `${battle.rightInk.hex}15`,
                    }}
                  >
                    <img src={battle.rightInk.image} alt="" className="w-6 h-6 object-contain" />
                  </div>
                </div>
              </div>
              <VoteBar
                leftLabel={battle.leftInk.name}
                rightLabel={battle.rightInk.name}
                leftVotes={battle.leftVotes}
                rightVotes={battle.rightVotes}
                onVoteLeft={() => handleCommunityVote(battle.id, "left")}
                onVoteRight={() => handleCommunityVote(battle.id, "right")}
              />
              <p className="mt-3 text-sm italic text-antique-gold font-body">
                “{battle.comment}” — {battle.commentAuthor}
              </p>
            </ParchmentCard>
          ))}
        </div>
      </div>
  );
};

export default InkBattle;
