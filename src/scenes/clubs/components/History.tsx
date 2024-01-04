import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History as HistoryPicto } from "lucide-react";
import GamesTable from "./GamesTable";
import supabaseClient from "@/utils/supabase";
import { useEffect, useState } from "react";
import { gameSummary } from "@/scenes/games/games.service";

export default function History({ clubId }: { clubId: number }) {
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState<gameSummary[]>([]);

  async function getGames() {
    setLoading(true);
    const { data, error } = await supabaseClient
      .from("games")
      .select(
        `
          id,
          created_at,
          status,
          club_id,
          creator_id,
          date,
          location,
          player_count: game_registrations (count),
          score,
          opponent: clubs!opponent_id (id, name)
        `
      )
      .eq("club_id", clubId)
      .lte("date", new Date().toISOString())
      .order("date", { ascending: false })
      .returns<gameSummary[]>();

    if (data) setGames(data);
    if (error) console.error(error);
    setLoading(false);
  }

  useEffect(() => {
    getGames();
  }, []);

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>
          <div className="flex gap-3 items-center">
            <HistoryPicto className="h-5 w-5" />
            Historique
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="overflow-auto">
        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : games?.length ? (
          <GamesTable games={games} />
        ) : (
          <p className="text-center">Aucun match joué.</p>
        )}
      </CardContent>
    </Card>
  );
}
