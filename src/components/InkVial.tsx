interface InkVialProps {
  image: string;
  name: string;
  brand: string;
  color: string;
  tags?: string[];
  onClick?: () => void;
  delay?: number;
}

const InkVial = ({ image, name, brand, color, tags = [], onClick, delay = 0 }: InkVialProps) => (
  <button
    onClick={onClick}
    className="group flex flex-col items-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-3 transition-transform hover:scale-105"
    style={{ animation: `fade-up 0.8s ease-out ${delay}ms forwards`, opacity: 0 }}
    aria-label={`${name} by ${brand}`}
  >
    <div className="relative w-28 h-28 md:w-32 md:h-32 mb-3">
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"
        style={{ backgroundColor: color }}
      />
      <img
        src={image}
        alt={`${name} ink bottle`}
        className="relative w-full h-full object-contain drop-shadow-lg group-hover:animate-gentle-float"
        loading="lazy"
      />
    </div>
    <h3 className="font-display text-sm font-semibold text-foreground leading-tight">{name}</h3>
    <p className="text-xs text-muted-foreground font-label">{brand}</p>
    {tags.length > 0 && (
      <div className="flex gap-1 mt-1.5 flex-wrap justify-center">
        {tags.map(tag => (
          <span key={tag} className="text-[9px] font-label px-1.5 py-0.5 rounded bg-secondary text-antique-gold">
            {tag}
          </span>
        ))}
      </div>
    )}
  </button>
);

export default InkVial;
