import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { X, Calendar } from "lucide-react";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface TeamProfileModalProps {
  teamId: string;
  onClose: () => void;
}

export default function TeamProfileModal({ teamId, onClose }: TeamProfileModalProps) {
  // Mock team data - in production this would come from the API
  const mockTeam = {
    id: teamId,
    name: "Chiz Borger Academy",
    logoUrl: null,
    region: "AP Region",
    tier: "Tier 3",
    badges: ["ProZone", "VLR.gg"],
    createdAt: "April 20, 2022",
    status: "Pending",
    stats: {
      rating: 4.95,
      gamesPlayed: 15,
      responseRate: 100,
      cancellationRate: 17,
    },
    reviews: {
      positive: 15,
      negative: 0,
      comments: [
        {
          id: 1,
          teamName: "KUZU ESPORTS",
          avatar: "bg-orange-500",
          comment: "Thanks for the games!",
          timeAgo: "1 month",
        },
        {
          id: 2,
          teamName: "Team Instinct",
          avatar: "bg-red-600",
          comment: "Opponent was nice.",
          timeAgo: "1 month",
        },
      ],
    },
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center md:justify-end">
      <div className="bg-discord-dark w-full max-w-md h-full md:ml-auto custom-scrollbar overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-discord-card">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white" data-testid="text-modal-title">
              Team Profile
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-discord-text hover:text-white p-2"
              data-testid="button-close-modal"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          {/* Team Header */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-orange-500 mx-auto mb-3 flex items-center justify-center">
              {mockTeam.logoUrl ? (
                <img
                  src={mockTeam.logoUrl}
                  alt={`${mockTeam.name} logo`}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-2xl font-bold">
                  {mockTeam.name.split(' ').map(word => word[0]).join('')}
                </span>
              )}
            </div>
            
            <h3 className="text-white text-xl font-semibold" data-testid="text-team-name">
              {mockTeam.name}
            </h3>
            <p className="text-discord-text" data-testid="text-team-region">
              {mockTeam.region}
            </p>
            
            <div className="flex items-center justify-center space-x-2 mt-2">
              <span className="bg-yellow-500 px-2 py-1 rounded text-white text-xs">
                {mockTeam.tier}
              </span>
              {mockTeam.badges.map((badge, index) => (
                <span 
                  key={index}
                  className={`px-2 py-1 rounded text-white text-xs ${
                    badge === "ProZone" ? "bg-purple-600" : "bg-red-500"
                  }`}
                  data-testid={`badge-${badge.toLowerCase().replace(".", "")}`}
                >
                  {badge}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-center text-discord-text text-sm mt-2">
              <Calendar className="w-4 h-4 mr-1" />
              <span data-testid="text-created-date">Created at {mockTeam.createdAt}</span>
            </div>
            
            <div className="bg-discord-accent/20 px-4 py-2 rounded-md mt-3">
              <span className="text-discord-accent" data-testid="text-team-status">
                🕐 {mockTeam.status}
              </span>
            </div>
          </div>
          
          {/* Team Stats */}
          <div className="bg-discord-card rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3" data-testid="text-stats-title">
              Team Stats
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-discord-text">Rating</span>
                <span className="text-discord-green font-medium" data-testid="text-team-rating">
                  {mockTeam.stats.rating}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-discord-text">Games Played</span>
                <span className="text-white" data-testid="text-games-played">
                  {mockTeam.stats.gamesPlayed}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-discord-text">Response Rate</span>
                <span className="text-discord-green" data-testid="text-response-rate">
                  {mockTeam.stats.responseRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-discord-text">Cancellation Rate</span>
                <span className="text-yellow-400" data-testid="text-cancellation-rate">
                  {mockTeam.stats.cancellationRate}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Reviews */}
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <span data-testid="text-reviews-title">Reviews</span>
              <span className="ml-2 text-discord-green" data-testid="text-positive-reviews">
                {mockTeam.reviews.positive} 👍
              </span>
              <span className="ml-2 text-discord-red" data-testid="text-negative-reviews">
                {mockTeam.reviews.negative} 👎
              </span>
            </h4>
            
            <div className="space-y-3">
              {mockTeam.reviews.comments.map((review) => (
                <div key={review.id} className="bg-discord-card p-3 rounded-md" data-testid={`review-${review.id}`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-6 h-6 rounded-full ${review.avatar}`}></div>
                    <span className="text-white text-sm font-medium" data-testid={`review-team-${review.id}`}>
                      {review.teamName}
                    </span>
                    <span className="text-discord-text text-xs" data-testid={`review-time-${review.id}`}>
                      {review.timeAgo}
                    </span>
                  </div>
                  <p className="text-discord-text text-sm" data-testid={`review-comment-${review.id}`}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
