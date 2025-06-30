
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Building2, 
  Users, 
  Package, 
  DollarSign, 
  BarChart3, 
  Calendar,
  Settings,
  CreditCard,
  FileText,
  LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainMenuItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: BarChart3,
    description: "Visão geral das obras"
  },
  { 
    title: "Obras", 
    url: "/obras", 
    icon: Building2,
    description: "Gerenciar obras ativas"
  },
  { 
    title: "Equipe", 
    url: "/equipe", 
    icon: Users,
    description: "Controle de funcionários"
  },
  { 
    title: "Materiais", 
    url: "/materiais", 
    icon: Package,
    description: "Estoque e compras"
  },
  { 
    title: "Financeiro", 
    url: "/financeiro", 
    icon: DollarSign,
    description: "Custos e pagamentos"
  },
  { 
    title: "Cronograma", 
    url: "/cronograma", 
    icon: Calendar,
    description: "Planejamento de etapas"
  },
  { 
    title: "Orçamentos", 
    url: "/orcamentos", 
    icon: FileText,
    description: "Criar e gerenciar orçamentos"
  }
];

const configItems = [
  { 
    title: "Assinatura", 
    url: "/assinatura", 
    icon: CreditCard,
    description: "Planos e pagamentos"
  },
  { 
    title: "Configurações", 
    url: "/configuracoes", 
    icon: Settings,
    description: "Preferências do sistema"
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    const active = isActive(path);
    return `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
      active 
        ? "bg-secondary text-white font-medium shadow-md" 
        : "text-white/80 hover:bg-white/10 hover:text-white"
    }`;
  };

  return (
    <Sidebar className="border-r-0 shadow-lg">
      <div className="gradient-bg h-full">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-white">ObraGo</h1>
                <p className="text-xs text-white/60">Gestão Inteligente</p>
              </div>
            )}
          </div>
        </div>

        <SidebarContent className="p-4">
          {/* Menu Principal */}
          <SidebarGroup>
            {!collapsed && (
              <SidebarGroupLabel className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3">
                Menu Principal
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {mainMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="p-0">
                      <NavLink to={item.url} className={getNavClass(item.url)}>
                        <item.icon className={`${collapsed ? 'w-5 h-5' : 'w-5 h-5'} flex-shrink-0`} />
                        {!collapsed && (
                          <div className="flex-1 min-w-0">
                            <span className="block font-medium">{item.title}</span>
                            <span className="text-xs opacity-60 block truncate">{item.description}</span>
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Configurações */}
          <SidebarGroup className="mt-8">
            {!collapsed && (
              <SidebarGroupLabel className="text-white/60 text-xs font-medium uppercase tracking-wider mb-3">
                Configurações
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {configItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="p-0">
                      <NavLink to={item.url} className={getNavClass(item.url)}>
                        <item.icon className={`${collapsed ? 'w-5 h-5' : 'w-5 h-5'} flex-shrink-0`} />
                        {!collapsed && (
                          <div className="flex-1 min-w-0">
                            <span className="block font-medium">{item.title}</span>
                            <span className="text-xs opacity-60 block truncate">{item.description}</span>
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="p-4 border-t border-white/10">
          {!collapsed ? (
            <div className="space-y-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-medium text-sm">João Silva</p>
                <p className="text-white/60 text-xs">Mestre de Obras</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-white/80 hover:text-white hover:bg-white/10 justify-start gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-white/80 hover:text-white hover:bg-white/10 p-2"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          )}
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
