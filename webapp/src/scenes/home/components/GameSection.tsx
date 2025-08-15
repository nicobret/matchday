import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/lib/auth/useAuth";
import { getUpcomingGamesByUserId } from "@/lib/game/gameService";
import useGames from "@/lib/game/useGames";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Search } from "lucide-react";
import GamesCarousel from "./GamesCarousel";

export default function GameSection() {
  const { isLoggedIn, isLoggedOut } = useAuth();

  return (
    <section id="games" className="">
      <h2 className="mt-8 scroll-m-20 text-3xl font-semibold tracking-tight">
        Matches à venir
      </h2>
      <p className="text-muted-foreground mt-2">
        Trouvez un match à jouer ou inscrivez-vous à un match déjà créé.
      </p>

      <Tabs defaultValue={isLoggedIn ? "my-games" : "search"} className="mt-4">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger
            value="my-games"
            disabled={isLoggedOut}
            className="w-1/2 sm:w-44"
          >
            <Calendar className="mr-2 inline-block h-4 w-4" />
            Mes matchs
          </TabsTrigger>
          <TabsTrigger value="search" className="w-1/2 sm:w-44">
            <Search className="mr-2 inline-block h-4 w-4" />
            Trouver un match
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-games">
          <MyUpcomingGames />
        </TabsContent>

        <TabsContent value="search">
          <AllUpcomingGames />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function MyUpcomingGames() {
  const { session } = useAuth();
  const { data, isPending, isError } = useQuery({
    queryFn: () => getUpcomingGamesByUserId(session!.user.id),
    queryKey: ["myGames", session?.user.id],
  });

  if (isPending) {
    return <p className="mt-4 text-center">Chargement des matches...</p>;
  }
  if (isError) {
    return (
      <p className="mt-4 text-center">
        Une erreur est survenue lors du chargement des matches.
      </p>
    );
  }
  if (data.length === 0) {
    return (
      <p className="mt-4 text-center">
        Aucun match trouvé. Créez un match pour commencer !
      </p>
    );
  }
  return <GamesCarousel games={data} />;
}

function AllUpcomingGames() {
  const { data, isPending, isError } = useGames({ when: "upcoming" });

  if (isPending) {
    return <p className="mt-4 text-center">Chargement des matches...</p>;
  }
  if (isError) {
    return (
      <p className="mt-4 text-center">
        Une erreur est survenue lors du chargement des matches.
      </p>
    );
  }
  if (data.length === 0) {
    return (
      <p className="mt-4 text-center">
        Aucun match trouvé. Créez un match pour commencer !
      </p>
    );
  }
  return <GamesCarousel games={data} />;
}
