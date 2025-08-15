import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Game } from "@/lib/game/gameService";
import GameCard from "@/scenes/club/components/GameCard";

export default function GamesCarousel({ games }: { games: Game[] }) {
  return (
    <Carousel className="mx-auto mt-4 w-2/3 md:w-auto">
      <CarouselContent className="flex w-full gap-4">
        {games.map((game) => (
          <CarouselItem key={game.id} className="sm:basis-1/2 md:basis-1/3">
            <GameCard game={game} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
