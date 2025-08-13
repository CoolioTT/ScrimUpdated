import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import ScrimCard from "./scrim-card";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ScrimListingsProps {
  onTeamClick?: (teamId: string) => void;
}

export default function ScrimListings({ onTeamClick }: ScrimListingsProps) {
  const { toast } = useToast();

  // Mock data for demonstration - in production this would come from the API
  const mockScrims = [
    {
      id: "1",
      time: "22:00",
      endTime: "23:00",
      team: {
        name: "WGamingg",
        rating: 0.00,
        rank: "Dia/Asc",
      },
      format: "1 Game",
      status: "booked" as const,
    },
    {
      id: "2",
      time: "22:30",
      team: {
        name: "Ascendants",
        rating: 4.93,
        rank: "Asc",
      },
      format: "Bo3",
      status: "booked" as const,
    },
    {
      id: "3",
      time: "23:00",
      team: {
        name: "M1go n friends",
        rating: 4.97,
        rank: "Asc",
      },
      format: "2 Games",
      status: "booked" as const,
    },
    {
      id: "4",
      time: "21:00",
      team: {
        name: "Orion Esport",
        rating: 3.01,
        rank: "T3",
        tier: "T3",
      },
      format: "1 Game - MR24",
      maps: "Any Map",
      status: "open" as const,
    },
  ];

  const tomorrowScrims = [
    {
      id: "5",
      time: "09:00",
      team: {
        name: "Endeavour Fury",
        rating: 4.88,
        rank: "T2",
        tier: "T2",
      },
      format: "Bo3",
      maps: "Ascent, Bind",
      status: "open" as const,
    },
  ];

  const handleBookScrim = (scrimId: string) => {
    toast({
      title: "Booking Scrim",
      description: "Sending scrim request...",
    });

    // Simulate booking process
    setTimeout(() => {
      toast({
        title: "Scrim Booked!",
        description: "Your scrim request has been sent successfully.",
      });
    }, 1500);
  };

  const getCurrentTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-SG", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Singapore",
    });
    return `Now ${timeString} SGT`;
  };

  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="flex-1 custom-scrollbar overflow-y-auto">
      <div className="p-4">
        {/* Header Info */}
        <div className="text-center py-2">
          <p className="text-discord-text text-sm" data-testid="text-last-refresh">
            Last refresh: 02:27 • <span className="text-discord-accent cursor-pointer">Scrim Guidelines</span>
          </p>
        </div>
        
        {/* Today Section */}
        <h2 className="text-lg font-semibold text-white mb-4 text-center" data-testid="text-today-date">
          Today, {getCurrentDate()}
        </h2>
        
        {/* Time Indicator */}
        <div className="flex justify-center mb-6">
          <span 
            className="bg-discord-red px-3 py-1 rounded-full text-white text-sm font-medium"
            data-testid="text-current-time"
          >
            {getCurrentTime()}
          </span>
        </div>
        
        {/* Today's Scrims */}
        <div className="space-y-4 mb-8">
          {mockScrims.map((scrim) => (
            <ScrimCard
              key={scrim.id}
              scrim={scrim}
              onTeamClick={onTeamClick}
              onBookScrim={handleBookScrim}
            />
          ))}
        </div>
        
        {/* Tomorrow Section */}
        <div className="pt-8">
          <h2 className="text-lg font-semibold text-white mb-4 text-center" data-testid="text-tomorrow-date">
            Tomorrow, {getTomorrowDate()}
          </h2>
          
          <div className="space-y-4">
            {tomorrowScrims.map((scrim) => (
              <ScrimCard
                key={scrim.id}
                scrim={scrim}
                onTeamClick={onTeamClick}
                onBookScrim={handleBookScrim}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
