import { Link } from "react-router-dom";

interface MetadataTagProps {
  type: "ink" | "paper" | "pen";
  name: string;
  href?: string;
}

const typeStyles = {
  ink: "bg-blue-900/30 text-blue-200 border-blue-700/40 hover:bg-blue-900/50",
  paper:
    "bg-amber-100/10 text-amber-100 border-amber-200/20 hover:bg-amber-100/20",
  pen: "bg-yellow-600/15 text-yellow-200 border-yellow-500/30 hover:bg-yellow-600/25",
};

const typeLabel = {
  ink: "Ink",
  paper: "Paper",
  pen: "Pen",
};

const baseClasses =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-label transition-colors";

const MetadataTag = ({ type, name, href }: MetadataTagProps) => {
  const content = `[${typeLabel[type]}: ${name}]`;
  const classes = `${baseClasses} ${typeStyles[type]}`;

  if (href) {
    return (
      <Link to={href} className={`${classes} hover:underline`}>
        {content}
      </Link>
    );
  }

  return <span className={classes}>{content}</span>;
};

export default MetadataTag;
