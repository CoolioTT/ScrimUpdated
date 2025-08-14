import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Users, MessageCircle, Gamepad2 } from "lucide-react";

export default function Scrims() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedMap, setSelectedMap] = useState("");
  const [gameFormat, setGameFormat] = useState("MR24");
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("scrims");

  const availableMaps = [
    "Dust2", "Mirage", "Inferno", "Cache", "Overpass", "Vertigo", "Ancient", "Nuke"
  ];

  const availableServers = [
    "US East", "US West", "EU West", "EU East", "Asia Pacific", "South America"
  ];

  const handleServerToggle = (server: string) => {
    setSelectedServers(prev => 
      prev.includes(server) 
        ? prev.filter(s => s !== server)
        : [...prev, server]
    );
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Top Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-discord-accent">ScrimHandler</div>
            
            {/* Navigation Tabs */}
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab("scrims")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  activeTab === "scrims"
                    ? "bg-discord-accent text-white"
                    : "text-discord-text hover:bg-gray-100"
                }`}
                data-testid="tab-scrims"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Scrims</span>
              </button>
              
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                  activeTab === "chat"
                    ? "bg-discord-accent text-white"
                    : "text-discord-text hover:bg-gray-100"
                }`}
                data-testid="tab-chat"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </button>
            </div>

            <Button 
              onClick={() => window.location.href = "/api/logout"}
              variant="outline"
              data-testid="button-logout"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "scrims" && (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Panel - Scrim Creation Form */}
            <div className="md:col-span-1">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-discord-text">Create Scrim</CardTitle>
                  <CardDescription>Schedule a new practice match</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-discord-text">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="border-gray-300"
                      data-testid="input-date"
                    />
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-discord-text">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="border-gray-300"
                      data-testid="input-time"
                    />
                  </div>

                  {/* Map Selection */}
                  <div className="space-y-2">
                    <Label className="text-discord-text">Map</Label>
                    <Select value={selectedMap} onValueChange={setSelectedMap}>
                      <SelectTrigger className="border-gray-300" data-testid="select-map">
                        <SelectValue placeholder="Select a map" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableMaps.map((map) => (
                          <SelectItem key={map} value={map}>{map}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Game Format */}
                  <div className="space-y-2">
                    <Label className="text-discord-text">Game Format</Label>
                    <Select value={gameFormat} onValueChange={setGameFormat}>
                      <SelectTrigger className="border-gray-300" data-testid="select-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MR12">MR12 (12 rounds)</SelectItem>
                        <SelectItem value="MR24">MR24 (24 rounds)</SelectItem>
                        <SelectItem value="MR30">MR30 (30 rounds)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Server Selection - Multiple Choice */}
                  <div className="space-y-2">
                    <Label className="text-discord-text">Preferred Servers (Select multiple)</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-3">
                      {availableServers.map((server) => (
                        <div key={server} className="flex items-center space-x-2">
                          <Checkbox
                            id={server}
                            checked={selectedServers.includes(server)}
                            onCheckedChange={() => handleServerToggle(server)}
                            data-testid={`checkbox-server-${server.replace(/\s+/g, '-').toLowerCase()}`}
                          />
                          <Label htmlFor={server} className="text-sm cursor-pointer">
                            {server}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-discord-accent hover:bg-blue-600" 
                    data-testid="button-create-scrim"
                  >
                    Create Scrim
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Available Scrims */}
            <div className="md:col-span-2">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-discord-text">Available Scrims</h2>
                  <Badge variant="secondary" className="bg-discord-card">
                    12 matches found
                  </Badge>
                </div>

                <div className="space-y-4">
                  {/* Sample Scrim Cards */}
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} className="border-gray-200 hover:border-discord-accent transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-4">
                              <h3 className="font-semibold text-discord-text">Team Alpha vs Looking for Scrim</h3>
                              <Badge 
                                variant="secondary" 
                                className={`${
                                  i % 2 === 0 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {i % 2 === 0 ? "MR24" : "MR12"}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-discord-text">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>Today, {14 + i}:00</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{availableMaps[i % availableMaps.length]}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>US East, EU West</span>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            size="sm" 
                            className="bg-discord-accent hover:bg-blue-600"
                            data-testid={`button-join-scrim-${i}`}
                          >
                            Join Match
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "chat" && (
          <div className="max-w-4xl mx-auto">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-discord-text">Chat</CardTitle>
                <CardDescription>Connect with other players and teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 border border-gray-300 rounded-md p-4 bg-gray-50">
                  <div className="text-center text-discord-text mt-32">
                    Chat functionality coming soon...
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Input 
                    placeholder="Type a message..." 
                    className="flex-1 border-gray-300"
                    data-testid="input-chat"
                  />
                  <Button 
                    className="bg-discord-accent hover:bg-blue-600"
                    data-testid="button-send-message"
                  >
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}