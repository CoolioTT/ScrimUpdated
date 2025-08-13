import { Button } from "@/components/ui/button";
import { Crown, Gamepad2, Star, Zap } from "lucide-react";

interface ScrimCardProps {
  scrim: {
    id: string;
    time: string;
    endTime?: string;
    team: {
      name: string;
      rating: number;
      rank: string;
      tier?: string;
      logoUrl?: string;
    };
    format: string;
    maps?: string;
    status: "open" | "booked";
  };
  onTeamClick?: (teamId: string) => void;
  onBookScrim?: (scrimId: string) => void;
}

export default function ScrimCard({ scrim, onTeamClick, onBookScrim }: ScrimCardProps) {
  const getTeamIcon = (teamName: string) => {
    if (teamName.toLowerCase().includes("ascendants")) return Crown;
    if (teamName.toLowerCase().includes("orion")) return Zap;
    if (teamName.toLowerCase().includes("endeavour")) return Star;
    return Gamepad2;
  };

  const getTeamIconColor = (teamName: string) => {
    if (teamName.toLowerCase().includes("ascendants")) return "bg-red-600";
    if (teamName.toLowerCase().includes("orion")) return "bg-purple-600";
    if (teamName.toLowerCase().includes("endeavour")) return "bg-blue-600";
    return "bg-purple-600";
  };

  const formatRating = (rating: number) => {
    return rating === 0 ? "(0.00)" : `(${rating.toFixed(2)})`;
  };

  const getRatingColor = (rating: number) => {
    if (rating === 0) return "text-orange-400";
    if (rating >= 4.5) return "text-discord-green";
    if (rating >= 3.0) return "text-orange-400";
    return "text-discord-red";
  };

  const TeamIcon = getTeamIcon(scrim.team.name);
  const isAvailable = scrim.status === "open";

  return (
    <div 
      className={`bg-discord-card rounded-lg p-4 hover:bg-discord-card/80 transition-colors cursor-pointer ${
        isAvailable ? "border-l-4 border-discord-green" : ""
      }`}
      onClick={() => !isAvailable && onTeamClick?.(scrim.id)}
      data-testid={`card-scrim-${scrim.id}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-white font-medium">
            <span data-testid={`text-scrim-time-${scrim.id}`}>{scrim.time}</span>
            {scrim.endTime && (
              <>
                <br />
                <span className="text-discord-text text-sm">{scrim.endTime}</span>
              </>
            )}
          </div>
          
          <div 
            className={`w-12 h-12 rounded-full ${getTeamIconColor(scrim.team.name)} flex items-center justify-center`}
            onClick={(e) => {
              e.stopPropagation();
              onTeamClick?.(scrim.id);
            }}
          >
            {scrim.team.logoUrl ? (
              <img
                src={scrim.team.logoUrl}
                alt={`${scrim.team.name} logo`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <TeamIcon className="w-6 h-6 text-white" />
            )}
          </div>
          
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onTeamClick?.(scrim.id);
            }}
          >
            <h3 className="text-white font-medium" data-testid={`text-team-name-${scrim.id}`}>
              {scrim.team.name}
            </h3>
            <div className="flex items-center space-x-2">
              <span 
                className={`text-sm ${getRatingColor(scrim.team.rating)}`}
                data-testid={`text-team-rating-${scrim.id}`}
              >
                {formatRating(scrim.team.rating)}
              </span>
              <span className="text-discord-green text-sm" data-testid={`text-team-rank-${scrim.id}`}>
                ● {scrim.team.rank}
              </span>
              {scrim.team.tier && (
                <span className="text-discord-yellow text-sm" data-testid={`text-team-tier-${scrim.id}`}>
                  🏆 {scrim.team.tier}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-white font-medium" data-testid={`text-scrim-format-${scrim.id}`}>
            {scrim.format}
          </p>
          {scrim.maps && (
            <p className="text-discord-text text-sm" data-testid={`text-scrim-maps-${scrim.id}`}>
              {scrim.maps}
            </p>
          )}
          {isAvailable ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onBookScrim?.(scrim.id);
              }}
              className="bg-discord-accent hover:bg-purple-600 text-white text-sm font-medium mt-1"
              data-testid={`button-book-scrim-${scrim.id}`}
            >
              Open
            </Button>
          ) : (
            <span 
              className="bg-discord-red px-2 py-1 rounded text-white text-xs inline-block mt-1"
              data-testid={`status-booked-${scrim.id}`}
            >
              BOOKED!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
