import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useGames from "@/lib/game/useGames";
import GameCard from "@/scenes/club/components/GameCard";

export default function GameSection() {
  const { data: games, isPending, isError } = useGames({ filter: "next" });
  return (
    <section id="games" className="">
      <h2 className="mt-10 scroll-m-20 text-3xl font-semibold tracking-tight">
        Matches
      </h2>
      <p className="text-muted-foreground mt-2">
        Trouvez un match à jouer ou inscrivez-vous à un match déjà créé.
      </p>
      {isPending ? (
        <p className="mt-4 text-center">Chargement des matchs...</p>
      ) : isError ? (
        <p className="mt-4 text-center">
          Une erreur est survenue lors du chargement des matchs.
        </p>
      ) : games.length === 0 ? (
        <p className="mt-4 text-center">
          Aucun match trouvé. Créez un match pour commencer !
        </p>
      ) : (
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
      )}
    </section>
  );
}
