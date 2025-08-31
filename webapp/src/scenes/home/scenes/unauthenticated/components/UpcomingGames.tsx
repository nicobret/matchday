import { Button } from "@/components/ui/button";
import useGames from "@/lib/game/useGames";
import { Search } from "lucide-react";
import GamesCarousel from "../../../components/GamesCarousel";

export default function UpcomingGames() {
  const { data, isPending, isError } = useGames({ when: "upcoming" });

  return (
    <section id="upcoming-games">
      <h2 className="font-new-amsterdam scroll-m-20 text-center text-4xl md:text-justify">
        Matches a venir
      </h2>
      {isPending ? (
        <p className="mt-4 text-center">Chargement des matches...</p>
      ) : isError ? (
        <p className="mt-4 text-center">
          Une erreur est survenue lors du chargement des matches.
        </p>
      ) : data.length === 0 ? (
        <p className="mt-4 text-center">
          Aucun match trouvé. Créez un match pour commencer !
        </p>
      ) : (
        <GamesCarousel games={data} />
      )}
      <div className="mt-4 flex">
        <Button variant="outline" className="mx-auto w-2/3 md:w-1/3">
          <Search className="inline-block h-4 w-4" />
          Chercher un match
        </Button>
      </div>
    </section>
  );
}
