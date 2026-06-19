import AppShell from "./components/AppShell";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import InkCodex from "./pages/InkCodex";
import Collection from "./pages/Collection";
import SwatchBook from "./pages/SwatchBook";
import SwatchBuilder from "./pages/SwatchBuilder";
import MarketAlcove from "./pages/MarketAlcove";
import InkSwap from "./pages/InkSwap";
import InkBattle from "./pages/InkBattle";
import CurrentlyInked from "./pages/CurrentlyInked";
import InkGrimoire from "./pages/InkGrimoire";
import Gallery from "./pages/Gallery";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/codex" element={<InkCodex />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/swatches" element={<SwatchBook />} />
          <Route path="/swatch-builder" element={<SwatchBuilder />} />
          <Route path="/market" element={<MarketAlcove />} />
          <Route path="/swap" element={<InkSwap />} />
          <Route path="/battle" element={<InkBattle />} />
          <Route path="/currently-inked" element={<CurrentlyInked />} />
          <Route path="/grimoire" element={<InkGrimoire />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
