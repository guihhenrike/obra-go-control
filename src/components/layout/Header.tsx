
import { Bell, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Buscar obras, funcionários..." 
              className="pl-10 w-96 bg-light-gray border-0 focus:ring-2 focus:ring-navy"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="relative text-navy hover:bg-light-gray">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full text-[10px] flex items-center justify-center text-white">
            3
          </span>
        </Button>

        <div className="h-8 w-px bg-gray-200" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-navy">{getUserDisplayName()}</p>
            <p className="text-xs text-gray-500">Plano Premium</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-navy to-light-blue rounded-full flex items-center justify-center text-white font-semibold">
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
