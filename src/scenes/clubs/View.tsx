import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useClubs } from "./useClubs";
import {
  Check,
  ChevronRight,
  History,
  Plus,
  PlusIcon,
  TrafficCone,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useStore from "@/utils/zustand";
import PlayersTable from "./components/PlayersTable";
import { clubType } from "./clubs.service";
import GamesCarousel from "./components/GamesCarousel";
import Container from "@/layout/Container";

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
  const upcomingGames = club?.games.filter(
    (g) => new Date(g.date) > new Date()
  );
  const pastGames = club?.games.filter((g) => new Date(g.date) < new Date());

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

  return (
    <>
      <Container>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Link to="/clubs">
            <p>Clubs</p>
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="#">
            <p>{club.name}</p>
          </Link>
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
                <PlusIcon className="h-5 w-5" />
                Rejoindre
              </Button>
            ))}
        </div>

        <p className="my-6">{club.description}</p>

        <hr className="my-8 w-32 md:max-w-96 mx-auto" />

        <h3 className="text-2xl font-semibold flex gap-3 items-center mt-6">
          <Trophy className="h-5 w-5" />
          Matches à venir
        </h3>

        {session && userIsAdmin(club, session) && (
          <div className="flex gap-3 items-center mt-1 mb-6">
            <Plus className="h-5 w-5" />
            <Link
              to={`/games/create?club=${club.id}`}
              className="underline underline-offset-2 hover:text-gray-500 gap-2"
            >
              Créer un match
            </Link>
          </div>
        )}

        {upcomingGames && upcomingGames.length ? (
          <GamesCarousel games={upcomingGames} />
        ) : (
          <p className="text-center">Aucun match</p>
        )}

        <hr className="my-8 w-32 md:max-w-96 mx-auto" />

        <h3 className="text-2xl font-semibold flex gap-3 items-center my-6">
          <History className="h-5 w-5" />
          Historique
        </h3>

        {pastGames && pastGames.length ? (
          <GamesCarousel games={pastGames} />
        ) : (
          <p className="text-center mt-8">Aucun match</p>
        )}

        <hr className="my-8 w-32 md:max-w-96 mx-auto" />

        <h3 className="text-2xl font-semibold flex gap-3 items-center my-6">
          <Users className="h-5 w-5" />
          Joueurs
        </h3>

        <PlayersTable />

        {session && userIsAdmin(club, session) && (
          <>
            <hr className="my-8 w-32 md:max-w-96 mx-auto" />

            <h3 className="text-2xl font-semibold flex gap-3 items-center my-6">
              <TrafficCone className="h-5 w-5" />
              Informations
            </h3>

            <p className="text-sm my-4">
              Créé par{" "}
              <Link to={`users/${club.creator.id}`}>
                <span className="text-gray-500 underline underline-offset-4 hover:text-gray-800">
                  {club.creator.firstname} {club.creator.lastname}
                </span>
              </Link>{" "}
              le{" "}
              {new Date(club.created_at).toLocaleDateString("fr-FR", {
                dateStyle: "long",
              })}
            </p>
          </>
        )}
      </Container>
    </>
  );
}
