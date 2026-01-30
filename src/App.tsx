import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import UeberUns from "./pages/UeberUns";
import News from "./pages/News";
import Kalender from "./pages/Kalender";
import Ressourcen from "./pages/Ressourcen";
import RessourcenEintragen from "./pages/RessourcenEintragen";
import Foerderung from "./pages/Foerderung";
import Mitmachen from "./pages/Mitmachen";
import Kontakt from "./pages/Kontakt";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NewsDetail from "./pages/NewsDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/ueber-uns" element={<UeberUns />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
            <Route path="/kalender" element={<Kalender />} />
            <Route path="/ressourcen" element={<Ressourcen />} />
            <Route path="/ressourcen/eintragen" element={<RessourcenEintragen />} />
            <Route path="/foerderung" element={<Foerderung />} />
            <Route path="/mitmachen" element={<Mitmachen />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
