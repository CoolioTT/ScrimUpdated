import { useState } from "react";
import { Gamepad2, Users, Layers, UserPlus, MessageCircle } from "lucide-react";

export default function MobileBottomNav() {
  const [activeTab, setActiveTab] = useState("scrims");

  const navItems = [
    { id: "scrims", icon: Gamepad2, label: "Scrims" },
    { id: "playmates", icon: Users, label: "Playmates" },
    { id: "groups", icon: Layers, label: "Groups" },
    { id: "recruit", icon: UserPlus, label: "Recruit" },
    { id: "chat", icon: MessageCircle, label: "Chat", badge: 2 },
  ];

  return (
    <div className="md:hidden bg-discord-dark border-t border-discord-card">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center py-2 px-3 transition-colors ${
              activeTab === item.id
                ? "text-discord-accent"
                : "text-discord-text hover:text-white"
            }`}
            data-testid={`button-nav-${item.id}`}
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.badge && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-discord-red rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {item.badge}
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
