import { Link } from "wouter";

import { buttonVariants } from "@/components/ui/button";
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
    <>
      {enableGameCreation && (
        <Link
          to={`~/game/create?clubId=${clubId}`}
          className={`mt-4 ${buttonVariants({ variant: "secondary" })}`}
        >
          <Plus className="mr-2 h-5 w-5" />
          Créer un match
        </Link>
      )}
      {games?.length ? (
        <Carousel className="mx-10 mt-4">
          <CarouselContent>
            {games.map((game) => (
              <CarouselItem
                key={game.id}
                className="lg:basis-1/2 xl:basis-1/3 2xl:basis-1/4"
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
    </>
  );
}
