import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useStore from "@/utils/zustand";
import { userIsInClub } from "../clubs/clubs.service";
import {
  fetchGame,
  gameType,
  joinGame,
  leaveGame,
  userIsInGame,
} from "./games.service";
import { useClubs } from "../clubs/useClubs";
import {
  Calendar,
  Check,
  Clipboard,
  ClipboardList,
  ClipboardSignature,
  Clock,
  Crown,
  MapPin,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Players from "./components/Players";
import Breadcrumbs from "@/components/Breadcrumbs";

// function userIsAdmin(club: clubType, session: any) {
//   return club.members
//     .filter((m) => m.role === "admin")
//     .map((m) => m.id)
//     .includes(session.user.id);
// }

export default function View() {
  const { id } = useParams();
  const [game, setGame] = useState<gameType | null>(null);
  const { club } = useClubs(game?.club_id.toString());
  const { session } = useStore();

  async function getGame(id: number) {
    const data = await fetchGame(id);
    if (!data) return;
    setGame(data);
  }

  useEffect(() => {
    if (!id) {
      console.error("No id provided");
      return;
    }
    getGame(parseInt(id));
  }, [id]);

  if (!game) return <p className="text-center animate_pulse">Chargement...</p>;

  return (
    <div className="p-4">
      <Breadcrumbs
        links={[
          { label: "Matches", link: "/games" },
          { label: "Match #" + game?.id, link: "#" },
        ]}
      />

      <div className="flex gap-4 items-end scroll-m-20 border-b pb-2 mt-6 mb-2">
        <h2 className="text-3xl font-semibold tracking-tight">
          Match #{game.id}
        </h2>
        <div className="pb-1">
          <Badge className="text-sm">{game.status}</Badge>
        </div>

        {session &&
          new Date(game.date) > new Date() &&
          club &&
          userIsInClub(session.user, club) &&
          (userIsInGame(session.user, game) ? (
            <Button
              onClick={() => leaveGame(game.id, session.user.id)}
              variant="secondary"
              className="flex gap-2 ml-auto"
            >
              <Check className="h-5 w-5" />
              <span className="hidden md:block">Inscrit</span>
            </Button>
          ) : (
            <Button
              onClick={() => joinGame(game.id, session.user.id)}
              className="flex gap-2 ml-auto"
            >
              <ClipboardSignature className="h-5 w-5" />
              <p className="hidden md:block">S'inscrire</p>
            </Button>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-3 items-center">
              <Clipboard className="h-5 w-5 flex-none" />
              Informations
              <Button
                asChild
                variant="link"
                className="gap-2 ml-auto h-auto p-0"
              >
                <Link to={`/games/${game.id}/edit`}>
                  <Pencil className="h-4 w-4" />
                  Modifier
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-3 items-center">
              <ClipboardSignature className="h-4 w-4" />
              {club?.name}
            </div>

            <div className="flex gap-3 items-center">
              <Calendar className="h-4 w-4" />
              {new Date(game.date).toLocaleDateString("fr-FR", {
                dateStyle: "long",
              })}
            </div>

            <div className="flex gap-3 items-center">
              <Clock className="h-4 w-4" />
              {new Date(game.date).toLocaleTimeString("fr-FR", {
                timeStyle: "short",
              })}
            </div>

            <div className="flex gap-3 items-center">
              <MapPin className="h-4 w-4 flex-none" />
              {game.location}
            </div>
          </CardContent>
        </Card>

        <Players game={game} />

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex gap-3 items-center">
              <ClipboardList className="h-5 w-5" />
              Compositions
            </CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex gap-3 items-center">
              <Crown className="h-5 w-5" />
              Résultat
            </CardTitle>
          </CardHeader>
          <CardContent>
            {new Date(game.date) > new Date() ? (
              <p className="text-center text-muted-foreground">
                Le match commence dans{" "}
                {Math.floor(
                  (new Date(game.date).getTime() - new Date().getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                jours.
              </p>
            ) : game.score ? (
              <p className="text-center">
                {game.score[0].toString()} - {game.score[1].toString()}
              </p>
            ) : (
              <p className="text-center">Aucun résultat.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
