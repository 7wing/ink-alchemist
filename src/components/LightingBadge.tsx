import { Sun, Lamp, ScanLine } from "lucide-react";

interface LightingBadgeProps {
  lighting: "Natural Sunlight" | "Warm Lamp" | "Scanner";
  className?: string;
}

const config = {
  "Natural Sunlight": {
    icon: Sun,
    styles: "bg-yellow-600/20 text-yellow-200 border-yellow-500/30",
  },
  "Warm Lamp": {
    icon: Lamp,
    styles: "bg-orange-600/20 text-orange-200 border-orange-500/30",
  },
  Scanner: {
    icon: ScanLine,
    styles: "bg-sky-600/20 text-sky-200 border-sky-500/30",
  },
};

const LightingBadge = ({ lighting, className = "" }: LightingBadgeProps) => {
  const { icon: Icon, styles } = config[lighting];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-label uppercase tracking-wider backdrop-blur-sm ${styles} ${className}`}
    >
      <Icon className="w-3 h-3" />
      {lighting}
    </span>
  );
};

export default LightingBadge;
