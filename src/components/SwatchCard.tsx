interface SwatchCardProps {
  image: string;
  inkName: string;
  paper: string;
  note?: string;
  delay?: number;
}

const SwatchCard = ({ image, inkName, paper, note, delay = 0 }: SwatchCardProps) => (
  <div
    className="group rounded-lg overflow-hidden border border-border bg-card/50 backdrop-blur-sm hover:border-antique-gold/30 transition-colors"
    style={{ animation: `fade-up 0.8s ease-out ${delay}ms forwards`, opacity: 0 }}
  >
    <div className="aspect-square overflow-hidden">
      <img
        src={image}
        alt={`${inkName} swatch on ${paper}`}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
      />
    </div>
    <div className="p-3">
      <h4 className="font-display text-sm font-semibold text-foreground">{inkName}</h4>
      <p className="text-xs text-muted-foreground font-label">on {paper}</p>
      {note && <p className="text-xs text-antique-gold font-label italic mt-1">"{note}"</p>}
    </div>
  </div>
);

export default SwatchCard;
