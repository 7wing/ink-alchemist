import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { BookOpen, Droplets, Library, ShoppingBag, Users, Settings, Home } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Scriptorium" },
  { to: "/codex", icon: BookOpen, label: "Ink Codex" },
  { to: "/collection", icon: Library, label: "My Collection" },
  { to: "/swatches", icon: Droplets, label: "Swatch Book" },
  { to: "/market", icon: ShoppingBag, label: "Market Alcove" },
  { to: "/gallery", icon: Users, label: "Gallery" },
  { to: "/settings", icon: Settings, label: "Candle Nook" },
];

const Navigation = () => {
  const { pathname } = useLocation();

  return (
    <nav className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col border-r border-border bg-card/80 backdrop-blur-sm z-40" aria-label="Main navigation">
      <div className="flex items-center gap-3 px-6 py-8 border-b border-border">
        <img src={logo} alt="Ink Obsidian logo" className="w-10 h-10 object-contain" />
        <div>
          <h1 className="font-display text-xl font-semibold text-foreground tracking-wide">Ink Obsidian</h1>
          <p className="text-xs text-muted-foreground font-label italic">The Collector's Scriptorium</p>
        </div>
      </div>

      <div className="flex-1 py-6 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-md font-label text-sm transition-colors ${
                active
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="px-6 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground font-label">247 inks catalogued</p>
      </div>
    </nav>
  );
};

export default Navigation;
