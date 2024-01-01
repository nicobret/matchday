import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { gameSummary } from "@/scenes/games/games.service";
import GameCard from "./GameCard";

export default function GamesCarousel({ games }: { games: gameSummary[] }) {
  return (
    <Carousel className="mx-8">
      <CarouselContent>
        {games.map((game) => (
          <CarouselItem key={game.id} className="md:basis-1/3">
            <GameCard game={game} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="text-gray-500 hover:text-gray-800" />
      <CarouselNext className="text-gray-500 hover:text-gray-800" />
    </Carousel>
  );
}
