import { Sparkles } from "lucide-react";
import ParchmentCard from "./ParchmentCard";
import { Button } from "./ui/button";

interface UserVial {
  name: string;
  ink: string;
  color: string;
}

interface MatchmakerBannerProps {
  userA: UserVial;
  userB: UserVial;
  onPropose: () => void;
  onDismiss: () => void;
}

const VialDisplay = ({ user }: { user: UserVial }) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className="w-10 h-10 rounded-full border border-white/10 shadow-vial"
      style={{ backgroundColor: user.color }}
    />
    <span className="text-xs font-label text-parchment">{user.name}</span>
    <span className="text-[10px] text-muted-foreground">{user.ink}</span>
  </div>
);

const MatchmakerBanner = ({
  userA,
  userB,
  onPropose,
  onDismiss,
}: MatchmakerBannerProps) => (
  <ParchmentCard className="border-2 border-gold">
    <div className="flex items-center gap-2 mb-4">
      <Sparkles className="w-4 h-4 text-antique-gold" />
      <span className="text-sm font-label text-antique-gold">
        The Scriptorium found a match for you
      </span>
    </div>

    <div className="flex items-center justify-around mb-4">
      <VialDisplay user={userA} />
      <span className="text-lg text-muted-foreground">⇄</span>
      <VialDisplay user={userB} />
    </div>

    <div className="flex gap-2 justify-end">
      <Button variant="outline" size="sm" onClick={onDismiss}>
        Dismiss
      </Button>
      <Button variant="default" size="sm" onClick={onPropose}>
        Propose Swap
      </Button>
    </div>
  </ParchmentCard>
);

export default MatchmakerBanner;
