import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useClub from "@/lib/club/useClub";
import { useMembers } from "@/lib/member/useMembers";
import { Calendar, ChartLine, Plus, Users } from "lucide-react";
import { useQueryState } from "nuqs";
import { Link, useParams } from "wouter";
import ClubHeader from "./components/ClubHeader";
import ClubHistory from "./components/ClubHistory";
import ClubInfo from "./components/ClubInfo";
import ClubMembers from "./components/ClubMembers";
import ClubStats from "./components/ClubStats";
import UpcomingGamesTable from "./components/UpcomingGamesTable";

export default function View() {
  const { id } = useParams();
  const clubId = Number(id);
  const { data: club, isPending, isError, isAdmin } = useClub(clubId);
  const { isMember } = useMembers(clubId);
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "schedule",
    clearOnDefault: false,
  });

  if (isPending) {
    return <p className="animate_pulse text-center">Chargement...</p>;
  }
  if (isError) {
    return <p className="text-center">Une erreur s'est produite.</p>;
  }
  return (
    <div className="mx-auto max-w-4xl p-2">
      <div className="grid flex-none gap-4">
        <ClubHeader club={club} />
        <ClubInfo club={club} isMember={isMember} isAdmin={isAdmin} />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-4">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="schedule" className="w-1/3 md:w-auto">
            <Calendar className="mr-2 h-4 w-4" />
            Matches
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="w-1/3 md:w-auto"
            disabled={!isMember}
          >
            <Users className="mr-2 h-4 w-4" />
            Membres
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="w-1/3 md:w-auto"
            disabled={!isMember}
          >
            <ChartLine className="mr-2 h-4 w-4" />
            Stats
          </TabsTrigger>
        </TabsList>

        <div className="bg-muted/50 mt-4 rounded-lg border px-4">
          <TabsContent value="schedule">
            <section id="schedule" className="">
              <h2 className="font-new-amsterdam mt-4 scroll-m-20 text-3xl">
                Calendrier
              </h2>
              {isMember && (
                <Link
                  to={`~/game/create?clubId=${club.id}`}
                  className={`mt-2 ${buttonVariants({ variant: "secondary", size: "sm" })}`}
                >
                  <Plus />
                  Créer un match
                </Link>
              )}
              <div className="mt-4 overflow-x-auto">
                <UpcomingGamesTable clubId={club.id} />
              </div>
            </section>

            {isMember && (
              <section id="history" className="mt-4">
                <h2 className="font-new-amsterdam scroll-m-20 text-3xl">
                  Historique
                </h2>
                <ClubHistory club={club} />
              </section>
            )}
          </TabsContent>

          <TabsContent value="members">
            <ClubMembers clubId={club.id} />
          </TabsContent>

          <TabsContent value="stats">
            <ClubStats clubId={club.id} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
