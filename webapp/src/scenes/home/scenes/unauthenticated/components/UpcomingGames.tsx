import { buttonVariants } from "@/components/ui/button";
import useGames from "@/lib/game/useGames";
import { Search } from "lucide-react";
import { Link } from "wouter";
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
        <p className="my-8 text-center">
          Aucun match trouvé. <Link to="~/game/create">Créez un match</Link>{" "}
          pour commencer !
        </p>
      ) : (
        <GamesCarousel games={data} />
      )}
      <div className="mx-auto mt-4 grid w-2/3 gap-2 md:w-full md:grid-cols-3 md:gap-4">
        <Link
          to="~/game/search"
          className={buttonVariants({ variant: "outline" })}
        >
          <Search className="h-4 w-4" />
          Chercher un match
        </Link>
      </div>
    </section>
  );
}
