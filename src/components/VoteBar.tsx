interface VoteBarProps {
  leftLabel: string;
  rightLabel: string;
  leftVotes: number;
  rightVotes: number;
  onVoteLeft?: () => void;
  onVoteRight?: () => void;
}

const VoteBar = ({
  leftLabel,
  rightLabel,
  leftVotes,
  rightVotes,
  onVoteLeft,
  onVoteRight,
}: VoteBarProps) => {
  const total = leftVotes + rightVotes;
  const leftPct = total === 0 ? 50 : (leftVotes / total) * 100;
  const rightPct = total === 0 ? 50 : (rightVotes / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-label text-muted-foreground">
        <button
          type="button"
          onClick={onVoteLeft}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <span>{leftLabel}</span>
          <span className="text-muted-foreground/70">({leftVotes})</span>
        </button>
        <button
          type="button"
          onClick={onVoteRight}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <span>{rightLabel}</span>
          <span className="text-muted-foreground/70">({rightVotes})</span>
        </button>
      </div>

      <div className="h-4 w-full rounded-full overflow-hidden flex bg-secondary">
        <button
          type="button"
          onClick={onVoteLeft}
          className="h-full bg-primary transition-all duration-500 hover:brightness-110"
          style={{ width: `${leftPct}%` }}
          aria-label={`Vote for ${leftLabel}`}
        />
        <button
          type="button"
          onClick={onVoteRight}
          className="h-full transition-all duration-500 hover:brightness-110"
          style={{
            width: `${rightPct}%`,
            backgroundColor: "hsl(var(--candlelight-dim))",
          }}
          aria-label={`Vote for ${rightLabel}`}
        />
      </div>
    </div>
  );
};

export default VoteBar;
