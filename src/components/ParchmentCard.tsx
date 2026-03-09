import { ReactNode } from "react";

interface ParchmentCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const ParchmentCard = ({ children, className = "", delay = 0 }: ParchmentCardProps) => (
  <div
    className={`relative rounded-lg border border-border bg-card/60 backdrop-blur-sm p-5 ${className}`}
    style={{
      animation: `page-unfold 0.6s ease-out ${delay}ms forwards`,
      opacity: 0,
      backgroundImage: "linear-gradient(135deg, hsl(40 30% 80% / 0.03) 0%, transparent 50%)",
    }}
  >
    {children}
  </div>
);

export default ParchmentCard;
