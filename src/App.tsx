
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Header } from "@/components/layout/Header";
import AuthGuard from "@/components/AuthGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Obras from "./pages/Obras";
import Equipe from "./pages/Equipe";
import Materiais from "./pages/Materiais";
import Financeiro from "./pages/Financeiro";
import Cronograma from "./pages/Cronograma";
import Orcamentos from "./pages/Orcamentos";
import Assinatura from "./pages/Assinatura";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="obrago-theme"
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={
              <AuthGuard>
                <SidebarProvider>
                  <div className="min-h-screen flex w-full bg-light-gray dark:bg-gray-900">
                    <AppSidebar />
                    <div className="flex-1 flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/admin" element={<Admin />} />
                          <Route path="/obras" element={<Obras />} />
                          <Route path="/equipe" element={<Equipe />} />
                          <Route path="/materiais" element={<Materiais />} />
                          <Route path="/financeiro" element={<Financeiro />} />
                          <Route path="/cronograma" element={<Cronograma />} />
                          <Route path="/orcamentos" element={<Orcamentos />} />
                          <Route path="/assinatura" element={<Assinatura />} />
                          <Route path="/configuracoes" element={<Configuracoes />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </div>
                </SidebarProvider>
              </AuthGuard>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
