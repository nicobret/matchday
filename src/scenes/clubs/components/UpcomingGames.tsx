import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trophy } from "lucide-react";
import GamesCarousel from "./GamesCarousel";
import { Link } from "react-router-dom";
import { clubType, userIsAdmin } from "../clubs.service";
import { buttonVariants } from "@/components/ui/button";
import useStore from "@/utils/zustand";

export default function UpcomingGames({ club }: { club: clubType }) {
  const { session } = useStore();

  const upcomingGames = club?.games
    .filter((g) => new Date(g.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card className="md:col-span-2 border-primary">
      <CardHeader>
        <CardTitle>
          <div className="flex gap-3 items-center">
            <Trophy className="h-5 w-5" />
            Matches à venir
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {!club ? (
          <p className="text-center">Chargement...</p>
        ) : upcomingGames && upcomingGames.length ? (
          <GamesCarousel games={upcomingGames} />
        ) : (
          <p className="text-center">Aucun match prévu.</p>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        {session && club && userIsAdmin(session.user, club) && (
          <Link
            to={`/games/create?clubId=${club.id}`}
            className={buttonVariants({ variant: "secondary" })}
          >
            <Plus className="h-5 w-5 mr-2" />
            Créer
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
