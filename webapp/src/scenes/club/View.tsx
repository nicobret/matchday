import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/lib/auth/useAuth";
import useClub from "@/lib/club/useClub";
import { useMembers } from "@/lib/member/useMembers";
import {
  Book,
  Calendar,
  ChartLine,
  ClipboardSignature,
  MapPin,
  Plus,
  Shield,
  Users,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { Link, useParams } from "wouter";
import ClubHistory from "./components/ClubHistory";
import ClubInviteMenu from "./components/ClubInviteMenu";
import ClubMembers from "./components/ClubMembers";
import ClubStats from "./components/ClubStats";
import JoinClubButton from "./components/JoinClubButton";
import LeaveClubButton from "./components/LeaveClubButton";
import UpcomingGamesTable from "./components/UpcomingGamesTable";

export default function View() {
  const { session } = useAuth();
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

  const userStatus = isAdmin
    ? "✓ Vous êtes administrateur"
    : isMember
      ? "✓ Vous êtes membre."
      : session
        ? "Vous n'êtes pas membre."
        : "Vous n'êtes pas connecté(e)";

  const address =
    club.address && club.postcode && club.city
      ? `${club.address}, ${club.postcode} ${club.city}`
      : "Adresse non renseignée.";

  return (
    <div className="mx-auto max-w-4xl p-2">
      <div className="max-w-xl flex-none">
        <header className="mx-auto flex gap-4">
          <div className="h-28 w-28 flex-none rounded-xl border-2 border-dashed"></div>
          <div>
            <h1 className="font-new-amsterdam line-clamp-1 scroll-m-20 text-4xl">
              {club.name}
            </h1>
            <p
              className={`text-muted-foreground mb-2 text-sm ${isMember ? "text-primary" : ""}`}
            >
              {userStatus}
            </p>
            {isMember ? (
              <ClubInviteMenu />
            ) : (
              <JoinClubButton clubId={club.id} />
            )}
          </div>
        </header>

        <div className="text-muted-foreground mt-4 rounded-lg border p-3 text-sm leading-loose">
          <p>
            <Shield className="mr-2 inline-block h-4 w-4 align-text-top" />
            Créé le{" "}
            {new Date(club.created_at).toLocaleDateString("fr-FR", {
              dateStyle: "long",
            })}
          </p>

          {club.description && (
            <p className="leading-relaxed">
              <Book className="mr-2 inline-block h-4 w-4 align-text-top" />
              {club.description}
            </p>
          )}

          <p>
            <MapPin className="mr-2 inline-block h-4 w-4 align-text-top" />
            {address}
          </p>

          <div className="mx-auto mt-2 grid max-w-lg grid-cols-2 gap-2">
            {isAdmin && (
              <Link
                to="/edit"
                className={buttonVariants({ variant: "outline" })}
              >
                <ClipboardSignature />
                Modifier
              </Link>
            )}
            {isMember && <LeaveClubButton clubId={club.id} />}
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mt-4">
        <TabsList className="w-full max-w-xl">
          <TabsTrigger value="schedule" className="w-1/3">
            <Calendar className="mr-2 h-4 w-4" />
            Matches
          </TabsTrigger>
          <TabsTrigger value="members" className="w-1/3" disabled={!isMember}>
            <Users className="mr-2 h-4 w-4" />
            Membres
          </TabsTrigger>
          <TabsTrigger value="stats" className="w-1/3" disabled={!isMember}>
            <ChartLine className="mr-2 h-4 w-4" />
            Stats
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <section id="schedule" className="mt-4">
            <h2 className="font-new-amsterdam scroll-m-20 text-4xl">
              Calendrier
            </h2>
            {isMember && (
              <Link
                to={`~/game/create?clubId=${club.id}`}
                className={`mt-2 ${buttonVariants({ variant: "secondary" })}`}
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
            <section id="history" className="mt-8">
              <h2 className="font-new-amsterdam scroll-m-20 text-4xl">
                Historique
              </h2>
              <ClubHistory club={club} />
            </section>
          )}
        </TabsContent>

        <TabsContent value="members">
          <section id="members" className="mt-8">
            <h2 className="font-new-amsterdam scroll-m-20 text-4xl">
              Liste des membres
            </h2>
            <ClubMembers clubId={club.id} />
          </section>
        </TabsContent>

        <TabsContent value="stats">
          <section id="stats" className="mt-8">
            <h2 className="font-new-amsterdam scroll-m-20 text-4xl">
              Statistiques
            </h2>
            <ClubStats clubId={club.id} />
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
