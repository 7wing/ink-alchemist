import { useState } from "react";

interface ReactionButtonProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  active?: boolean;
  onClick?: () => void;
}

const baseClasses =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-label transition-colors select-none";

const inactiveClasses =
  "bg-secondary/40 border-border text-muted-foreground hover:bg-secondary/60";

const activeClasses = "bg-primary/20 border-primary/40 text-primary";

const ReactionButton = ({
  icon,
  label,
  count,
  active: activeProp,
  onClick,
}: ReactionButtonProps) => {
  const isControlled = onClick !== undefined;
  const [internal, setInternal] = useState({ active: false, count });

  const active = isControlled ? (activeProp ?? false) : internal.active;
  const displayCount = isControlled ? count : internal.count;

  const handleClick = () => {
    if (isControlled) {
      onClick!();
      return;
    }
    setInternal((prev) => {
      const nextActive = !prev.active;
      return {
        active: nextActive,
        count: nextActive ? prev.count + 1 : prev.count - 1,
      };
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
    >
      {icon}
      <span>{label}</span>
      <span className="opacity-60">·</span>
      <span>{displayCount}</span>
    </button>
  );
};

export default ReactionButton;
