import { SessionContext } from "@/components/auth-provider";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Book,
  Calendar,
  ClipboardSignature,
  MapPin,
  Plus,
  Shield,
  Users,
} from "lucide-react";
import { useContext } from "react";
import { Link, useParams } from "wouter";
import ClubHistory from "./components/ClubHistory";
import ClubMembers from "./components/ClubMembers";
import ClubStats from "./components/ClubStats";
import CopyButton from "./components/CopyButton";
import JoinClubButton from "./components/JoinClubButton";
import LeaveClubButton from "./components/LeaveClubButton";
import UpcomingGamesTable from "./components/UpcomingGamesTable";
import useClub from "./lib/club/useClub";
import { useMembers } from "./lib/member/useMembers";

export default function View() {
  const { session } = useContext(SessionContext);
  const { id } = useParams();
  const clubId = Number(id);
  const { data: club, isIdle, isLoading, isError, isAdmin } = useClub(clubId);
  const { isMember } = useMembers(clubId);

  if (isIdle || isLoading) {
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

  return (
    <div className="mx-auto max-w-[100rem] gap-8 p-2 md:flex">
      <div className="flex-none md:w-96 md:pr-4">
        <header className="mx-auto flex max-w-lg gap-4">
          <div className="h-28 w-28 flex-none rounded-xl border-2 border-dashed"></div>
          <div>
            <h1 className="text-3xl leading-none font-semibold tracking-tight uppercase">
              {club.name}
            </h1>

            <p
              className={`text-muted-foreground mt-2 text-sm ${isMember ? "text-primary" : ""}`}
            >
              {userStatus}
            </p>
          </div>
        </header>

        <div className="mx-auto mt-6 grid max-w-lg grid-cols-2 gap-2">
          {isMember ? (
            <LeaveClubButton clubId={club.id} />
          ) : (
            <JoinClubButton clubId={club.id} />
          )}

          <CopyButton />

          {isAdmin && (
            <Link
              to="/edit"
              className={buttonVariants({ variant: "secondary" })}
            >
              <ClipboardSignature className="mr-2 inline-block h-5 w-5" />
              Modifier
            </Link>
          )}
        </div>

        <div className="text-muted-foreground mx-auto mt-6 max-w-lg rounded-sm border p-3 text-sm">
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

          <div className="mt-1 flex gap-2">
            <MapPin className="inline-block h-4 w-4" />
            {club.address && club.postcode && club.city ? (
              <div>
                <p>{club.address}</p>
                <p>
                  {club.postcode} {club.city}
                </p>
              </div>
            ) : (
              <p className="leading-relaxed">Adresse non renseignée.</p>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="schedule" className="mt-8 w-full md:mt-0">
        <TabsList>
          <TabsTrigger value="schedule" className="w-32">
            <Calendar className="mr-2 inline-block h-4 w-4" />
            Matches
          </TabsTrigger>
          <TabsTrigger value="members" className="w-32">
            <Users className="mr-2 inline-block h-4 w-4" />
            Membres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <section id="schedule" className="mt-8">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
              Calendrier
            </h2>
            {isMember && (
              <Link
                to={`~/game/create?clubId=${club.id}`}
                className={`mt-4 ${buttonVariants({ variant: "secondary" })}`}
              >
                <Plus className="mr-2 h-5 w-5" />
                Créer un match
              </Link>
            )}
            <div className="mt-8 overflow-x-auto">
              <UpcomingGamesTable clubId={club.id} />
            </div>
          </section>

          <section id="history" className="mt-10">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
              Historique
            </h2>
            <ClubHistory club={club} />
          </section>
        </TabsContent>

        <TabsContent value="members">
          <section id="stats" className="mt-8">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
              Statistiques
            </h2>
            <ClubStats clubId={club.id} />
          </section>

          <section id="members" className="mt-8">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
              Liste des membres
            </h2>
            <ClubMembers clubId={club.id} />
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
