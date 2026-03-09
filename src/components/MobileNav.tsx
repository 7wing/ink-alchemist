import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, Library, Droplets, Users } from "lucide-react";

const items = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/codex", icon: BookOpen, label: "Codex" },
  { to: "/collection", icon: Library, label: "Collection" },
  { to: "/swatches", icon: Droplets, label: "Swatches" },
  { to: "/gallery", icon: Users, label: "Gallery" },
];

const MobileNav = () => {
  const { pathname } = useLocation();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-card/90 backdrop-blur-md py-2 safe-area-bottom" aria-label="Mobile navigation">
      {items.map(({ to, icon: Icon, label }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 min-w-[60px] min-h-[60px] justify-center rounded-lg transition-colors ${
              active ? "text-primary" : "text-muted-foreground"
            }`}
            aria-current={active ? "page" : undefined}
            aria-label={label}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-label">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
