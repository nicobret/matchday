import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Club, userIsMember } from "../club.service";
import supabase from "@/utils/supabase";
import { gameSummary } from "@/scenes/game/games.service";

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
import GameCard from "./GameCard";
import { Plus, Trophy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SessionContext } from "@/components/auth-provider";

export default function UpcomingGames({ club }: { club: Club }) {
  const { session } = useContext(SessionContext);
  const [games, setGames] = useState<gameSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getGames() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("games")
          .select("*, game_registrations(*)")
          .eq("club_id", club.id)
          .gte("date", new Date().toISOString())
          .order("date");

        if (error) throw new Error(error.message);
        if (data) setGames(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getGames();
  }, [club.id]);

  if (loading) {
    return <p className="text-center">Chargement...</p>;
  }

  return (
    <Card className="md:col-span-2 flex flex-col">
      <CardHeader>
        <CardTitle>
          <div className="flex gap-3 items-center">
            <Trophy className="h-5 w-5" />
            Matches à venir
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : games.length ? (
          <Carousel className="mx-10">
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
        ) : (
          <p className="text-center">Aucun match prévu.</p>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2 mt-auto">
        {session?.user && club && userIsMember(session?.user, club) && (
          <Link
            to={`/game/create?clubId=${club.id}`}
            className={buttonVariants({ variant: "secondary" })}
          >
            <Plus className="h-5 w-5 mr-2" />
            Créer
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
