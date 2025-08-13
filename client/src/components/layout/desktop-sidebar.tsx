import { useAuth } from "@/hooks/useAuth";
import { Gamepad2, Users, Layers, UserPlus, MessageCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DesktopSidebar() {
  const { user } = useAuth();

  const navItems = [
    { icon: Gamepad2, label: "Scrims", href: "/scrims", active: true },
    { icon: Users, label: "Playmates", href: "/playmates" },
    { icon: Layers, label: "Groups", href: "/groups" },
    { icon: UserPlus, label: "Recruit", href: "/recruit" },
    { icon: MessageCircle, label: "Chat", href: "/chat" },
  ];

  return (
    <div className="hidden md:flex">
      <div className="w-64 bg-discord-dark h-screen fixed left-0 top-0 custom-scrollbar overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-discord-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold" data-testid="text-app-name">
                ScrimHandler
              </h2>
              <p className="text-discord-text text-sm" data-testid="text-region">
                AP Region
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                item.active
                  ? "bg-discord-accent/20 text-discord-accent"
                  : "text-discord-text hover:bg-discord-card hover:text-white"
              }`}
              data-testid={`link-${item.label.toLowerCase()}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        
        {/* User Profile */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between p-3 bg-discord-card rounded-md">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-semibold">
                    {user?.firstName?.[0] || user?.email?.[0] || "U"}
                  </span>
                )}
              </div>
              <div>
                <p className="text-white text-sm font-medium" data-testid="text-username">
                  {user?.firstName || user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-discord-text text-xs" data-testid="status-online">
                  Online
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/api/logout'}
              className="text-discord-text hover:text-white p-1"
              data-testid="button-settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
