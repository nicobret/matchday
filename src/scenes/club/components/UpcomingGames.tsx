import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Club, Game, fetchUpcomingGames, isMember } from "../lib/club.service";

import { SessionContext } from "@/components/auth-provider";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Plus } from "lucide-react";
import GameCard from "./GameCard";

export default function UpcomingGames({ club }: { club: Club }) {
  const { session } = useContext(SessionContext);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchUpcomingGames(club.id)
      .then((data) => setGames(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [club.id]);

  if (loading) {
    return <p className="text-center">Chargement...</p>;
  }

  return (
    <Card className="flex flex-col md:col-span-2" id="upcoming">
      <CardHeader>
        <CardTitle>
          <p>Matches à venir</p>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : games.length ? (
          <Carousel className="mx-10">
            <CarouselContent>
              {games.map((game) => (
                <CarouselItem
                  key={game.id}
                  className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <GameCard game={game} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="text-gray-500 hover:text-gray-800" />
            <CarouselNext className="text-gray-500 hover:text-gray-800" />
          </Carousel>
        ) : (
          <p className="text-center">Aucun match prévu.</p>
        )}
      </CardContent>

      <CardFooter className="mt-auto flex justify-end gap-2">
        {session?.user && club && isMember(session?.user, club) && (
          <Link
            to={`/game/create?clubId=${club.id}`}
            className={buttonVariants({ variant: "secondary" })}
          >
            <Plus className="mr-2 h-5 w-5" />
            Créer
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
