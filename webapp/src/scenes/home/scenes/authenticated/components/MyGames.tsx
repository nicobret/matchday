import { buttonVariants } from "@/components/ui/button";
import useAuth from "@/lib/auth/useAuth";
import { getUpcomingGamesByUserId } from "@/lib/game/gameService";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Link } from "wouter";
import GamesCarousel from "../../../components/GamesCarousel";

export default function MyGames() {
  const { session } = useAuth();
  const { data, isPending, isError } = useQuery({
    queryFn: () => getUpcomingGamesByUserId(session!.user.id),
    queryKey: ["myGames", session?.user.id],
  });

  return (
    <section id="my-games">
      <h2 className="font-new-amsterdam scroll-m-20 text-center text-4xl md:text-justify">
        Mes prochains matches
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
