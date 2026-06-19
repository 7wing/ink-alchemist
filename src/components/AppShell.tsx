import { ReactNode } from "react";
import Navigation from "./Navigation";
import MobileNav from "./MobileNav";
import CandleOverlay from "./CandleOverlay";

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => (
  <div className="relative min-h-screen bg-vignette">
    <CandleOverlay />
    <Navigation />
    <main className="pb-24 lg:pb-8 lg:pl-72">
      {children}
    </main>
    <MobileNav />
  </div>
);

export default AppShell;
