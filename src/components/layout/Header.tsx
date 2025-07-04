
import { Bell, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchNotifications(user.id);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchNotifications(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchNotifications = async (userId: string) => {
    try {
      // Buscar obras com prazo próximo
      const { data: obrasVencendo, error } = await supabase
        .from("obras")
        .select("nome, previsao_fim")
        .eq("user_id", userId)
        .gte("previsao_fim", new Date().toISOString().split('T')[0])
        .lte("previsao_fim", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      if (error) throw error;

      const notifs = obrasVencendo?.map(obra => ({
        id: `obra-${obra.nome}`,
        message: `Obra "${obra.nome}" tem prazo próximo: ${new Date(obra.previsao_fim).toLocaleDateString('pt-BR')}`,
        type: 'warning'
      })) || [];

      setNotifications(notifs);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar em obras, funcionários e materiais
      const [obrasResult, funcionariosResult, materiaisResult] = await Promise.all([
        supabase
          .from("obras")
          .select("*")
          .eq("user_id", user.id)
          .ilike("nome", `%${searchTerm}%`),
        supabase
          .from("funcionarios")
          .select("*")
          .eq("user_id", user.id)
          .ilike("nome", `%${searchTerm}%`),
        supabase
          .from("materiais")
          .select("*")
          .eq("user_id", user.id)
          .ilike("nome", `%${searchTerm}%`)
      ]);

      console.log("Resultados da pesquisa:", {
        obras: obrasResult.data,
        funcionarios: funcionariosResult.data,
        materiais: materiaisResult.data
      });

      // Redirecionar para a primeira página com resultados
      if (obrasResult.data && obrasResult.data.length > 0) {
        navigate("/obras");
      } else if (funcionariosResult.data && funcionariosResult.data.length > 0) {
        navigate("/equipe");
      } else if (materiaisResult.data && materiaisResult.data.length > 0) {
        navigate("/materiais");
      } else {
        alert("Nenhum resultado encontrado para: " + searchTerm);
      }
    } catch (error) {
      console.error("Erro na pesquisa:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  const getUserDisplayName = () => {
    if (!user) return "Usuário";
    
    // Try to get name from user metadata first
    const firstName = user.user_metadata?.first_name;
    const lastName = user.user_metadata?.last_name;
    const fullName = user.user_metadata?.full_name;
    
    if (fullName) return fullName;
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    
    // Fallback to email
    if (user.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1);
    }
    
    return "Usuário";
  };

  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    const names = displayName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-navy hover:bg-light-gray" />
        <div className="hidden md:block">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Buscar obras, funcionários, materiais..." 
              className="pl-10 w-96 bg-light-gray border-0 focus:ring-2 focus:ring-navy"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative text-navy hover:bg-light-gray"
            onClick={() => {
              if (notifications.length > 0) {
                alert(notifications.map(n => n.message).join('\n'));
              } else {
                alert('Nenhuma notificação no momento');
              }
            }}
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full text-[10px] flex items-center justify-center text-white">
                {notifications.length}
              </span>
            )}
          </Button>
        </div>

        <div className="h-8 w-px bg-gray-200" />

        <div className="flex items-center gap-3">
          <div 
            className="text-right hidden sm:block cursor-pointer"
            onClick={() => navigate('/configuracoes')}
          >
            <p className="text-sm font-medium text-navy hover:text-secondary transition-colors">{getUserDisplayName()}</p>
            <p className="text-xs text-gray-500">Construtor</p>
          </div>
          <div 
            className="w-10 h-10 bg-gradient-to-br from-navy to-light-blue rounded-full flex items-center justify-center text-white font-semibold cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/configuracoes')}
          >
            {getUserInitials()}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-navy hover:bg-light-gray"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
