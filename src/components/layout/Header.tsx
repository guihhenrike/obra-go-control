
import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Header() {
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
            <p className="text-sm font-medium text-navy">João Silva</p>
            <p className="text-xs text-gray-500">Plano Premium</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-navy to-light-blue rounded-full flex items-center justify-center text-white font-semibold">
            JS
          </div>
        </div>
      </div>
    </header>
  );
}
