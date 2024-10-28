import { Link } from "react-router-dom";

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
import useGames from "../lib/useGames";
import GameCard from "./GameCard";

export default function UpcomingGames({
  clubId,
  enableGameCreation,
}: {
  clubId: number;
  enableGameCreation: boolean;
}) {
  const { data: games } = useGames(clubId, "next");
  return (
    <Card id="upcoming">
      <CardHeader>
        <CardTitle>
          <p>Matches à venir</p>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {games?.length ? (
          <Carousel className="mx-10">
            <CarouselContent>
              {games.map((game) => (
                <CarouselItem
                  key={game.id}
                  className="lg:basis-1/2 xl:basis-1/3"
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

      <CardFooter>
        {enableGameCreation && (
          <Link
            to={`/game/create?clubId=${clubId}`}
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
