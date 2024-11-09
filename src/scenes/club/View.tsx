import { SessionContext } from "@/components/auth-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { queryClient } from "@/lib/react-query";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import {
  Ban,
  Book,
  Calendar,
  ClipboardSignature,
  Copy,
  MapPin,
  Shield,
  Users,
} from "lucide-react";
import { useContext, useState } from "react";
import { Link, useParams } from "wouter";
import ClubHistory from "./components/ClubHistory";
import ClubMembers from "./components/ClubMembers";
import ClubStats from "./components/ClubStats";
import UpcomingGames from "./components/UpcomingGames";
import { Club, joinClub, leaveClub } from "./lib/club.service";
import useClub from "./lib/useClub";

export default function View() {
  const { session } = useContext(SessionContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const {
    data: club,
    isIdle,
    isLoading,
    isError,
    isMember,
    isAdmin,
  } = useClub(Number(id));

  async function handleJoin(club: Club) {
    if (!session?.user) {
      if (
        window.confirm(
          "Pour rejoindre un club, veuillez vous inscrire ou vous connecter.",
        )
      ) {
        window.location.href = "/auth?redirectTo=" + window.location.pathname;
      }
      return;
    }
    if (isMember) {
      throw new Error("User is already a member.");
    }

    setLoading(true);
    try {
      await joinClub(club.id, session.user.id);
      queryClient.invalidateQueries(["club", club.id]);
    } catch (error) {
      window.alert("Une erreur est survenue.");
      console.error(error);
    }
    setLoading(false);
  }

  async function handleLeave(club: Club) {
    if (!session?.user) {
      throw new Error("Vous n'êtes pas connecté.");
    }
    if (!window.confirm("Voulez-vous vraiment quitter ce club ?")) {
      return;
    }

    setLoading(true);
    try {
      await leaveClub(club.id, session.user.id);
      queryClient.invalidateQueries(["club", club.id]);
    } catch (error) {
      window.alert("Une erreur est survenue.");
      console.error(error);
    }
    setLoading(false);
  }

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
    <div className="mx-auto max-w-[100rem] gap-4 p-4 md:flex">
      <div className="flex-none md:w-96 md:px-2">
        <header className="mx-auto flex max-w-lg gap-4">
          <div className="h-28 w-28 flex-none rounded-xl border-2 border-dashed"></div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {club.name}
            </h1>

            <p
              className={`mt-2 text-sm text-muted-foreground ${isMember ? "text-primary" : ""}`}
            >
              {userStatus}
            </p>
          </div>
        </header>

        <div className="mx-auto mt-6 grid max-w-lg grid-cols-2 gap-2">
          {!isMember ? (
            <Button
              onClick={() => handleJoin(club)}
              disabled={loading}
              className="flex gap-2"
            >
              <ClipboardSignature className="h-5 w-5" />
              Rejoindre
            </Button>
          ) : (
            <Button
              onClick={() => handleLeave(club)}
              disabled={loading}
              variant="secondary"
              className="flex gap-2"
            >
              <Ban className="inline-block h-5 w-5" />
              Quitter
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={() => copyToClipboard(window.location.href)}
          >
            <Copy className="mr-2 inline-block h-5 w-5" />
            {copiedText ? "Copié !" : "Copier le lien"}
          </Button>

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

        <div className="mx-auto mt-6 max-w-lg rounded-lg border p-4">
          <p>
            <Shield className="mr-2 inline-block h-5 w-5" />
            Créé le{" "}
            {new Date(club.created_at).toLocaleDateString("fr-FR", {
              dateStyle: "long",
            })}
          </p>

          {club.description && (
            <p className="mt-2 leading-relaxed">
              <Book className="mr-2 inline-block h-5 w-5" />
              {club.description}
            </p>
          )}

          <div className="mt-2 flex gap-2">
            <MapPin className="h-5 w-5" />
            {club.address && club.postcode && club.city ? (
              <div>
                <p className="leading-relaxed">{club.address}</p>
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

      <Tabs defaultValue="schedule" className="mt-6 w-full md:mt-0">
        <TabsList className="w-full">
          <TabsTrigger value="schedule" className="w-1/2">
            <Calendar className="mr-2 inline-block h-4 w-4" />
            Calendrier
          </TabsTrigger>
          <TabsTrigger value="members" className="w-1/2">
            <Users className="mr-2 inline-block h-4 w-4" />
            Membres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <div className="mb-36 grid grid-cols-1 gap-2">
            <UpcomingGames clubId={club.id} enableGameCreation={isMember} />
            <ClubHistory club={club} />
          </div>
        </TabsContent>
        <TabsContent value="members">
          <div className="mb-36 grid grid-cols-1 gap-2">
            <ClubStats clubId={club.id} />
            <ClubMembers clubId={club.id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
