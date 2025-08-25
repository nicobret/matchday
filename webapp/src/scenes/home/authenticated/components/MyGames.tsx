import { buttonVariants } from "@/components/ui/button";
import useAuth from "@/lib/auth/useAuth";
import { getUpcomingGamesByUserId } from "@/lib/game/gameService";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Link } from "wouter";
import GamesCarousel from "../../components/GamesCarousel";

export default function MyGames() {
  const { session } = useAuth();
  const { data, isPending, isError } = useQuery({
    queryFn: () => getUpcomingGamesByUserId(session!.user.id),
    queryKey: ["myGames", session?.user.id],
  });

  return (
    <section id="my-games">
      <h2 className="mt-4 scroll-m-20 text-2xl font-semibold tracking-tight">
        Matches à venir
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
        <Link
          href="/games/search"
          className={`${buttonVariants({ variant: "outline" })} mx-auto w-2/3 md:w-auto`}
        >
          <Search className="inline-block h-4 w-4" />
          Chercher un match
        </Link>
      </div>
    </section>
  );
}
