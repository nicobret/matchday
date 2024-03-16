import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useClubs } from "./useClubs";
import {
  Book,
  Check,
  ChevronRight,
  Clipboard,
  ClipboardSignature,
  MapPin,
  Pencil,
  Plus,
  Shield,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useStore from "@/utils/zustand";
import PlayersTable from "./components/PlayersTable";
import { clubType } from "./clubs.service";
import GamesCarousel from "./components/GamesCarousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import History from "./components/History";

function userIsInClub(club: clubType, session: any) {
  return club.members.map((m) => m.id).includes(session.user.id);
}

function userIsAdmin(club: clubType, session: any) {
  return club.members
    .filter((m) => m.role === "admin")
    .map((m) => m.id)
    .includes(session.user.id);
}

export default function View() {
  const { session } = useStore();
  const { id } = useParams();
  const { club, fetchClub, joinClub, leaveClub } = useClubs();

  useEffect(() => {
    if (!id) {
      console.error("No id provided");
      return;
    }
    async function getClub(id: string) {
      await fetchClub(id);
    }
    getClub(id);
  }, [id]);

  if (!club) return <p className="text-center animate_pulse">Chargement...</p>;

  const upcomingGames = club.games
    .filter((g) => new Date(g.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="p-4">
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/clubs">Clubs</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="#">{club.name}</Link>
      </div>

      <div className="flex gap-4 items-end scroll-m-20 border-b pb-3 mt-6 mb-2">
        <h2 className="text-3xl font-semibold tracking-tight">{club.name}</h2>

        <div className="flex gap-2 items-center">
          {club.members.length}
          <Users className="h-4 w-4" />
        </div>

        {session &&
          (userIsInClub(club, session) ? (
            <Button
              onClick={() => leaveClub(club.id)}
              variant="secondary"
              className="flex gap-2 ml-auto"
            >
              <Check className="h-5 w-5" />
              <span className="hidden md:block">Rejoint</span>
            </Button>
          ) : (
            <Button
              onClick={() => joinClub(club.id)}
              className="flex gap-2 ml-auto"
            >
              <ClipboardSignature className="h-5 w-5" />
              Rejoindre
            </Button>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              <div className="flex gap-3 items-center">
                <Trophy className="h-5 w-5" />
                Matches à venir
              </div>
            </CardTitle>
            {session && userIsAdmin(club, session) && (
              <div className="flex gap-3 items-center mt-1 mb-6">
                <Plus className="h-5 w-5" />
                <Link
                  to={`/games/create?clubId=${club.id}`}
                  className="underline underline-offset-2 hover:text-primary gap-2"
                >
                  Créer un match
                </Link>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {upcomingGames && upcomingGames.length ? (
              <GamesCarousel games={upcomingGames} />
            ) : (
              <p className="text-center">Aucun match prévu.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex gap-3 items-center">
                <Users className="h-5 w-5" />
                Membres
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {club.members.length === 0 ? (
              <p className="text-center">Aucun joueur dans ce club.</p>
            ) : (
              <PlayersTable players={club.members} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex gap-3 items-center">
                <Clipboard className="h-5 w-5" />
                Informations
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex gap-3 items-center">
              <Shield className="h-5 w-5" />
              <p>
                Créé le{" "}
                {new Date(club.created_at).toLocaleDateString("fr-FR", {
                  dateStyle: "long",
                })}
              </p>
            </div>

            <div className="flex gap-3">
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

            {club.description && (
              <div className="flex gap-3">
                <Book className="h-5 w-5 flex-none" />
                <p className="leading-relaxed">{club.description}</p>
              </div>
            )}

            {session && userIsAdmin(club, session) && (
              <div className="flex gap-3">
                <Pencil className="h-5 w-5" />
                <Link
                  to={`/clubs/${club.id}/edit`}
                  className="underline underline-offset-2 hover:text-primary"
                >
                  Modifier
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <History clubId={club.id} />
      </div>
    </div>
  );
}
