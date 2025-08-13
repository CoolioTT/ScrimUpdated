import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock } from "lucide-react";

interface ScrimFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

export default function ScrimFilters({ onFiltersChange }: ScrimFiltersProps) {
  const [selectedServers, setSelectedServers] = useState<string[]>(["HK"]);
  const [filters, setFilters] = useState({
    day: "Today",
    time: "Now",
    format: "1 Game",
    map: "Any Map",
  });

  const servers = ["HK", "SG", "JP", "SYD", "MB"];

  const handleServerToggle = (server: string) => {
    setSelectedServers(prev => 
      prev.includes(server) 
        ? prev.filter(s => s !== server)
        : [...prev, server]
    );
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.({ ...newFilters, servers: selectedServers });
  };

  return (
    <div className="bg-discord-dark p-4 border-b border-discord-card">
      <div className="flex flex-col space-y-4">
        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white" data-testid="text-page-title">
            Find Scrims
          </h1>
          <Button 
            className="bg-discord-accent hover:bg-purple-600 text-white font-medium"
            data-testid="button-post-lfs"
          >
            Post LFS
          </Button>
        </div>
        
        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Filter */}
          <div>
            <label className="block text-discord-text text-sm mb-2">Day</label>
            <Select value={filters.day} onValueChange={(value) => handleFilterChange("day", value)}>
              <SelectTrigger 
                className="w-full bg-discord-card border-discord-text/20 text-white"
                data-testid="select-day"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-discord-card border-discord-text/20">
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="Tomorrow">Tomorrow</SelectItem>
                <SelectItem value="This Week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Time Filter */}
          <div>
            <label className="block text-discord-text text-sm mb-2">Time</label>
            <Select value={filters.time} onValueChange={(value) => handleFilterChange("time", value)}>
              <SelectTrigger 
                className="w-full bg-discord-card border-discord-text/20 text-white"
                data-testid="select-time"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-discord-card border-discord-text/20">
                <SelectItem value="Now">Now</SelectItem>
                <SelectItem value="Next Hour">Next Hour</SelectItem>
                <SelectItem value="Evening">Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Format Filter */}
          <div>
            <label className="block text-discord-text text-sm mb-2">Format</label>
            <Select value={filters.format} onValueChange={(value) => handleFilterChange("format", value)}>
              <SelectTrigger 
                className="w-full bg-discord-card border-discord-text/20 text-white"
                data-testid="select-format"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-discord-card border-discord-text/20">
                <SelectItem value="1 Game">1 Game</SelectItem>
                <SelectItem value="2 Games">2 Games</SelectItem>
                <SelectItem value="3 Games">3 Games</SelectItem>
                <SelectItem value="Bo3">Bo3</SelectItem>
                <SelectItem value="Bo5">Bo5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Map Filter */}
          <div>
            <label className="block text-discord-text text-sm mb-2">Map</label>
            <Select value={filters.map} onValueChange={(value) => handleFilterChange("map", value)}>
              <SelectTrigger 
                className="w-full bg-discord-card border-discord-text/20 text-white"
                data-testid="select-map"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-discord-card border-discord-text/20">
                <SelectItem value="Any Map">Any Map</SelectItem>
                <SelectItem value="Ascent">Ascent</SelectItem>
                <SelectItem value="Bind">Bind</SelectItem>
                <SelectItem value="Haven">Haven</SelectItem>
                <SelectItem value="Split">Split</SelectItem>
                <SelectItem value="Icebox">Icebox</SelectItem>
                <SelectItem value="Breeze">Breeze</SelectItem>
                <SelectItem value="Fracture">Fracture</SelectItem>
                <SelectItem value="Pearl">Pearl</SelectItem>
                <SelectItem value="Lotus">Lotus</SelectItem>
                <SelectItem value="Sunset">Sunset</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Server Regions */}
        <div>
          <label className="block text-discord-text text-sm mb-2">Servers</label>
          <div className="flex flex-wrap gap-2 items-center">
            {servers.map((server) => (
              <button
                key={server}
                onClick={() => handleServerToggle(server)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedServers.includes(server)
                    ? "bg-discord-accent text-white"
                    : "bg-discord-card text-discord-text hover:bg-discord-accent hover:text-white"
                }`}
                data-testid={`button-server-${server.toLowerCase()}`}
              >
                {server}
              </button>
            ))}
            <span className="text-discord-text text-sm flex items-center ml-2">
              <Clock className="w-4 h-4 mr-1" />
              <span data-testid="text-scrims-left">0 left</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
