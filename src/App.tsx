import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import InkCodex from "./pages/InkCodex";
import Collection from "./pages/Collection";
import SwatchBook from "./pages/SwatchBook";
import MarketAlcove from "./pages/MarketAlcove";
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
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/codex" element={<InkCodex />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/swatches" element={<SwatchBook />} />
          <Route path="/market" element={<MarketAlcove />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
