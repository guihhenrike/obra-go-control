
import { Home, Building2, Users, Package, DollarSign, FileText, Calendar, Settings, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Obras", url: "/obras", icon: Building2 },
  { title: "Equipe", url: "/equipe", icon: Users },
  { title: "Materiais", url: "/materiais", icon: Package },
  { title: "Financeiro", url: "/financeiro", icon: DollarSign },
  { title: "Orçamentos", url: "/orcamentos", icon: FileText },
  { title: "Cronograma", url: "/cronograma", icon: Calendar },
  { title: "Configurações", url: "/configuracoes", icon: Settings }
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Como não temos tabela profiles, vamos usar dados do auth
        setUserProfile({
          nome: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
          profissao: 'Construtor'
        });
      }
    } catch (error) {
      console.error("Erro ao buscar perfil:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold text-navy mb-4">
            ConstructPRO
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={isActive(item.url) ? "bg-secondary text-white" : ""}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12"
                      onClick={() => navigate(item.url)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.title}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarFallback className="bg-secondary text-white">
              {userProfile?.nome?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-navy truncate">
              {userProfile?.nome || 'Carregando...'}
            </p>
            <p className="text-xs text-gray-500">
              {userProfile?.profissao || ''}
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-gray-600 hover:text-gray-900"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
