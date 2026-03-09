interface PropertyBarProps {
  label: string;
  value: number; // 0-100
  color?: string;
}

const PropertyBar = ({ label, value, color = "hsl(var(--primary))" }: PropertyBarProps) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-label text-muted-foreground">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-1 bg-secondary rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

export default PropertyBar;
