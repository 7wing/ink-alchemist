interface WaxSealBadgeProps {
  label: string;
  variant?: "default" | "limited" | "discontinued";
}

const variants = {
  default: "bg-secondary text-antique-gold",
  limited: "bg-wax-seal text-parchment",
  discontinued: "bg-burgundy text-parchment",
};

const WaxSealBadge = ({ label, variant = "default" }: WaxSealBadgeProps) => (
  <span className={`inline-flex items-center px-2.5 py-1 text-[10px] font-label uppercase tracking-wider rounded-full ${variants[variant]}`}>
    {label}
  </span>
);

export default WaxSealBadge;
