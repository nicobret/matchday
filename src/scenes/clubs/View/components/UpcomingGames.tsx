import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useStore from "@/utils/zustand";
import { Club, userIsAdmin } from "../../clubs.service";
import supabaseClient from "@/utils/supabase";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trophy } from "lucide-react";
import GamesCarousel from "./GamesCarousel";
import { buttonVariants } from "@/components/ui/button";
import { gameSummary } from "@/scenes/games/games.service";

export default function UpcomingGames({ club }: { club: Club }) {
  const { user } = useStore();

  const [games, setGames] = useState<gameSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getGames() {
      try {
        setLoading(true);

        const { data, error } = await supabaseClient
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
    <Card className="md:col-span-2">
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
          <GamesCarousel games={games} />
        ) : (
          <p className="text-center">Aucun match prévu.</p>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        {user && club && userIsAdmin(user, club) && (
          <Link
            to={`/games/create?clubId=${club.id}`}
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
