import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import DesktopSidebar from "@/components/layout/desktop-sidebar";
import MobileHeader from "@/components/layout/mobile-header";
import MobileBottomNav from "@/components/layout/mobile-bottom-nav";
import ScrimFilters from "@/components/scrim/scrim-filters";
import ScrimListings from "@/components/scrim/scrim-listings";
import TeamProfileModal from "@/components/team/team-profile-modal";

export default function Scrims() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-discord-darker flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-discord-darker font-inter text-white">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        {/* Scrim Filters */}
        <ScrimFilters />

        {/* Scrim Listings */}
        <ScrimListings onTeamClick={setSelectedTeamId} />

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>

      {/* Team Profile Modal */}
      {selectedTeamId && (
        <TeamProfileModal
          teamId={selectedTeamId}
          onClose={() => setSelectedTeamId(null)}
        />
      )}
    </div>
  );
}
