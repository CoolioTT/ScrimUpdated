import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Users, MessageCircle, Gamepad2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Scrims() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedMap, setSelectedMap] = useState("");
  const [gameFormat, setGameFormat] = useState("MR24");
  const [numberOfGames, setNumberOfGames] = useState("1");
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("scrims");
  const { toast } = useToast();

  const availableMaps = [
    "Bind", "Haven", "Split", "Ascent", "Icebox", "Breeze", "Fracture", "Pearl", "Lotus", "Sunset"
  ];

  const availableServers = [
    "Asia Pacific (Sydney)", "Asia Pacific (Tokyo)", "Asia Pacific (Singapore)", "Asia Pacific (Hong Kong)"
  ];

  const handleServerToggle = (server: string) => {
    setSelectedServers(prev => 
      prev.includes(server) 
        ? prev.filter(s => s !== server)
        : [...prev, server]
    );
  };

  const handleJoinMatch = (matchId: number) => {
    toast({
      title: "Joined Match",
      description: `Successfully joined scrim match #${matchId}!`,
      variant: "default",
    });
  };

  const handleCreateScrim = () => {
    if (!selectedDate || !selectedTime || !selectedMap || selectedServers.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to create a scrim.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Scrim Created",
      description: `Created ${gameFormat} scrim for ${selectedMap} on ${selectedDate} at ${selectedTime}`,
      variant: "default",
    });

    // Reset form
    setSelectedDate("");
    setSelectedTime("");
    setSelectedMap("");
    setSelectedServers([]);
  };

  return (
    <div className="min-h-screen bg-discord-darker text-discord-text">
      {/* Top Navigation */}
      <div className="border-b border-discord-card bg-discord-dark">
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
                    : "text-discord-text hover:bg-discord-card"
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
                    : "text-discord-text hover:bg-discord-card"
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
              className="border-discord-card text-discord-text hover:bg-discord-card"
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
              <Card className="border-discord-card bg-discord-card">
                <CardHeader>
                  <CardTitle className="text-discord-text">Create Scrim</CardTitle>
                  <CardDescription className="text-discord-text opacity-70">Schedule a new practice match</CardDescription>
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
                      className="border-discord-dark bg-discord-darker text-discord-text"
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
                      className="border-discord-dark bg-discord-darker text-discord-text"
                      data-testid="input-time"
                    />
                  </div>

                  {/* Map Selection */}
                  <div className="space-y-2">
                    <Label className="text-discord-text">Map</Label>
                    <Select value={selectedMap} onValueChange={setSelectedMap}>
                      <SelectTrigger className="border-discord-dark bg-discord-darker text-discord-text" data-testid="select-map">
                        <SelectValue placeholder="Select a map" />
                      </SelectTrigger>
                      <SelectContent className="bg-discord-card border-discord-dark">
                        {availableMaps.map((map) => (
                          <SelectItem key={map} value={map} className="text-discord-text hover:bg-discord-darker">{map}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Number of Games */}
                  <div className="space-y-2">
                    <Label className="text-discord-text">Number of Games</Label>
                    <Select value={numberOfGames} onValueChange={setNumberOfGames}>
                      <SelectTrigger className="border-discord-dark bg-discord-darker text-discord-text" data-testid="select-games">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-discord-card border-discord-dark">
                        <SelectItem value="1" className="text-discord-text hover:bg-discord-darker">1 Game</SelectItem>
                        <SelectItem value="2" className="text-discord-text hover:bg-discord-darker">2 Games</SelectItem>
                        <SelectItem value="3" className="text-discord-text hover:bg-discord-darker">3 Games</SelectItem>
                        <SelectItem value="5" className="text-discord-text hover:bg-discord-darker">5 Games</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Match Format */}
                  <div className="space-y-2">
                    <Label className="text-discord-text">Match Format</Label>
                    <Select value={gameFormat} onValueChange={setGameFormat}>
                      <SelectTrigger className="border-discord-dark bg-discord-darker text-discord-text" data-testid="select-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-discord-card border-discord-dark">
                        <SelectItem value="Regular" className="text-discord-text hover:bg-discord-darker">Regular Match</SelectItem>
                        <SelectItem value="MR24" className="text-discord-text hover:bg-discord-darker">MR24</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Server Selection - Multiple Choice */}
                  <div className="space-y-2">
                    <Label className="text-discord-text">Preferred Servers (Select multiple)</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-discord-dark rounded-md p-3 bg-discord-darker">
                      {availableServers.map((server) => (
                        <div key={server} className="flex items-center space-x-2">
                          <Checkbox
                            id={server}
                            checked={selectedServers.includes(server)}
                            onCheckedChange={() => handleServerToggle(server)}
                            className="border-discord-text"
                            data-testid={`checkbox-server-${server.replace(/\s+/g, '-').toLowerCase()}`}
                          />
                          <Label htmlFor={server} className="text-sm cursor-pointer text-discord-text">
                            {server}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={handleCreateScrim}
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
                  <Badge variant="secondary" className="bg-discord-card text-discord-text">
                    12 matches found
                  </Badge>
                </div>

                <div className="space-y-4">
                  {/* Sample Scrim Cards */}
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Card key={i} className="border-discord-card bg-discord-card hover:border-discord-accent transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-4">
                              <h3 className="font-semibold text-discord-text">Team Alpha vs Looking for Scrim</h3>
                              <Badge 
                                variant="secondary" 
                                className={`${
                                  i % 2 === 0 ? "bg-discord-green/20 text-discord-green" : "bg-discord-accent/20 text-discord-accent"
                                }`}
                              >
                                {i % 2 === 0 ? "MR24" : "Regular"}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-discord-text opacity-70">
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
                                <span>Asia Pacific (Tokyo)</span>
                              </div>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => handleJoinMatch(i)}
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
            <Card className="border-discord-card bg-discord-card">
              <CardHeader>
                <CardTitle className="text-discord-text">Chat</CardTitle>
                <CardDescription className="text-discord-text opacity-70">Connect with other players and teams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 border border-discord-dark rounded-md p-4 bg-discord-darker">
                  <div className="text-center text-discord-text mt-32">
                    Chat functionality coming soon...
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Input 
                    placeholder="Type a message..." 
                    className="flex-1 border-discord-dark bg-discord-darker text-discord-text"
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