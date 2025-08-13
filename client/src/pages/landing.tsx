import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, Users, Trophy, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-discord-darker">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-orange-500 flex items-center justify-center">
              <Gamepad2 className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-6">
            ScrimHandler
          </h1>
          
          <p className="text-xl text-discord-text mb-8 max-w-2xl mx-auto">
            Find your perfect scrim. Connect with teams. Elevate your gameplay.
            The ultimate platform for competitive esports team management and scrim finding.
          </p>
          
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="bg-discord-accent hover:bg-purple-600 text-white px-8 py-4 text-lg font-semibold"
            data-testid="button-login"
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Everything you need to compete
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-discord-card border-discord-card text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-discord-accent flex items-center justify-center mb-4">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <CardTitle>Find Scrims</CardTitle>
              <CardDescription className="text-discord-text">
                Discover and join scrims that match your skill level and schedule
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-discord-card border-discord-card text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-discord-green flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <CardTitle>Team Management</CardTitle>
              <CardDescription className="text-discord-text">
                Manage your team roster, stats, and performance analytics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-discord-card border-discord-card text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-discord-yellow flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6" />
              </div>
              <CardTitle>Rating System</CardTitle>
              <CardDescription className="text-discord-text">
                Build your reputation with our comprehensive rating and review system
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-discord-card border-discord-card text-white">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-discord-red flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <CardTitle>Real-time Updates</CardTitle>
              <CardDescription className="text-discord-text">
                Get instant notifications for scrim requests and team activities
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-discord-dark border-discord-accent text-center">
          <CardContent className="py-12">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to compete at the next level?
            </h3>
            <p className="text-discord-text mb-6 max-w-2xl mx-auto">
              Join thousands of teams already using ScrimHandler to find competitive matches
              and improve their gameplay.
            </p>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              size="lg"
              className="bg-discord-accent hover:bg-purple-600 text-white"
              data-testid="button-login-cta"
            >
              Start Finding Scrims
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
