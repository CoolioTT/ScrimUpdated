import { useAuth } from "@/hooks/useAuth";
import { Menu, Search, Bell, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileHeader() {
  const { user } = useAuth();

  return (
    <div className="md:hidden bg-discord-dark px-4 py-3 flex items-center justify-between border-b border-discord-card">
      <Button
        variant="ghost"
        size="sm"
        className="text-discord-text hover:text-white p-2"
        data-testid="button-menu"
      >
        <Menu className="w-5 h-5" />
      </Button>
      
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
          <Gamepad2 className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-semibold text-sm" data-testid="text-app-name-mobile">
            ScrimHandler
          </span>
          <span className="text-discord-text text-xs" data-testid="text-region-mobile">
            AP
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          className="text-discord-text hover:text-white p-2"
          data-testid="button-search"
        >
          <Search className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-discord-text hover:text-white p-2 relative"
          data-testid="button-notifications"
        >
          <Bell className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
