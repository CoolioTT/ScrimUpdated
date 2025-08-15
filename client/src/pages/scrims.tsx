import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, Users, MessageCircle, Gamepad2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function Scrims() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedMaps, setSelectedMaps] = useState<string[]>([]);
  const [gameFormat, setGameFormat] = useState("MR24");
  const [numberOfGames, setNumberOfGames] = useState("1");
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("scrims");
  const [showJoinModal, setShowJoinModal] = useState<number | null>(null);
  const [joinMessage, setJoinMessage] = useState("");
  const [selectedMapsForJoin, setSelectedMapsForJoin] = useState<string[]>([]);
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

  const handleMapToggle = (map: string) => {
    setSelectedMaps(prev => 
      prev.includes(map) 
        ? prev.filter(m => m !== map)
        : [...prev, map]
    );
  };

  const handleJoinRequest = (matchId: number) => {
    setShowJoinModal(matchId);
    // Get available maps for this scrim
    const scrimMaps = availableMaps.slice(0, 2 + (matchId % 3));
    setSelectedMapsForJoin([]); // Reset selection
  };

  const handleJoinMapToggle = (map: string) => {
    setSelectedMapsForJoin(prev => 
      prev.includes(map) 
        ? prev.filter(m => m !== map)
        : [...prev, map]
    );
  };

  const submitJoinRequest = () => {
    if (!joinMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please add a message with your join request.",
        variant: "destructive",
      });
      return;
    }

    if (selectedMapsForJoin.length === 0) {
      toast({
        title: "Map Selection Required",
        description: "Please select at least one map you'd like to play.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Join Request Sent",
      description: `Your request to join scrim #${showJoinModal} has been sent. Maps: ${selectedMapsForJoin.join(", ")}`,
      variant: "default",
    });

    setShowJoinModal(null);
    setJoinMessage("");
    setSelectedMapsForJoin([]);
  };

  const handleCreateScrim = () => {
    if (!selectedDate || !selectedTime || selectedMaps.length === 0 || selectedServers.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to create a scrim.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Scrim Created",
      description: `Created ${gameFormat} scrim for ${selectedMaps.join(", ")} on ${selectedDate} at ${selectedTime}`,
      variant: "default",
    });

    // Reset form
    setSelectedDate("");
    setSelectedTime("");
    setSelectedMaps([]);
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

                  {/* Map Selection - Multiple Choice */}
                  <div className="space-y-2">
                    <Label className="text-discord-text">Maps (Select multiple)</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-discord-dark rounded-md p-3 bg-discord-darker">
                      {availableMaps.map((map) => (
                        <div key={map} className="flex items-center space-x-2">
                          <Checkbox
                            id={map}
                            checked={selectedMaps.includes(map)}
                            onCheckedChange={() => handleMapToggle(map)}
                            className="border-discord-text"
                            data-testid={`checkbox-map-${map.toLowerCase()}`}
                          />
                          <Label htmlFor={map} className="text-sm cursor-pointer text-discord-text">
                            {map}
                          </Label>
                        </div>
                      ))}
                    </div>
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
                  {[1, 2, 3, 4, 5].map((i) => {
                    const scrimMaps = availableMaps.slice(0, 2 + (i % 3)); // Show 2-4 maps per scrim
                    return (
                      <Card key={i} className="border-discord-card bg-discord-card hover:border-discord-accent transition-colors">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-3">
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
                                  <Users className="w-4 h-4" />
                                  <span>Asia Pacific (Tokyo)</span>
                                </div>
                              </div>

                              {/* Available Maps */}
                              <div className="space-y-1">
                                <div className="text-xs text-discord-text opacity-50">Available Maps:</div>
                                <div className="flex flex-wrap gap-1">
                                  {scrimMaps.map((map) => (
                                    <Badge 
                                      key={map} 
                                      variant="outline" 
                                      className="text-xs border-discord-accent/30 text-discord-accent"
                                    >
                                      {map}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              onClick={() => handleJoinRequest(i)}
                              size="sm" 
                              className="bg-discord-accent hover:bg-blue-600"
                              data-testid={`button-request-join-${i}`}
                            >
                              Request to Join
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
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

      {/* Join Request Modal */}
      {showJoinModal && (
        <Dialog open={!!showJoinModal} onOpenChange={() => setShowJoinModal(null)}>
          <DialogContent className="bg-discord-card border-discord-dark text-discord-text max-w-md">
            <DialogHeader>
              <DialogTitle className="text-discord-text">Request to Join Scrim #{showJoinModal}</DialogTitle>
              <DialogDescription className="text-discord-text opacity-70">
                Select the maps you'd like to play and send a message to the team owner.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Available Maps Selection */}
              <div className="space-y-2">
                <Label className="text-discord-text">Select Maps You Want to Play</Label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-discord-dark rounded-md p-3 bg-discord-darker">
                  {availableMaps.slice(0, 2 + (showJoinModal % 3)).map((map) => (
                    <div key={map} className="flex items-center space-x-2">
                      <Checkbox
                        id={`join-${map}`}
                        checked={selectedMapsForJoin.includes(map)}
                        onCheckedChange={() => handleJoinMapToggle(map)}
                        className="border-discord-text"
                        data-testid={`checkbox-join-map-${map.toLowerCase()}`}
                      />
                      <Label htmlFor={`join-${map}`} className="text-sm cursor-pointer text-discord-text">
                        {map}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="join-message" className="text-discord-text">Message to Team Owner</Label>
                <Textarea
                  id="join-message"
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  placeholder="Hi! I'd like to join your scrim. We're a competitive team looking for good practice..."
                  className="border-discord-dark bg-discord-darker text-discord-text min-h-[100px]"
                  data-testid="textarea-join-message"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setShowJoinModal(null)}
                className="border-discord-card text-discord-text hover:bg-discord-card"
                data-testid="button-cancel-join"
              >
                Cancel
              </Button>
              <Button
                onClick={submitJoinRequest}
                className="bg-discord-accent hover:bg-blue-600"
                data-testid="button-send-request"
              >
                Send Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}