import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import supabaseClient from "@/utils/supabase";
import { Hourglass, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { gameType } from "../games.service";
import PlayersTable from "./PlayersTable";

export type gamePlayer = {
  id: number;
  created_at: string;
  game_id: number;
  user_id: number;
  status: string;
  profile: {
    id: number;
    firstname: string;
    lastname: string;
    avatar: string;
    status: string;
  };
};

export default function Players({ game }: { game: gameType }) {
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<gamePlayer[]>([]);

  async function get() {
    if (!game.id) return;
    setLoading(true);
    const { data, error } = await supabaseClient
      .from("game_registrations")
      .select("*, profile: user_id (id, firstname, lastname, avatar, status)")
      .eq("game_id", game.id);
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }
    setPlayers(data);
    setLoading(false);
  }

  useEffect(() => {
    get();
  }, [game]);

  if (!game.id) return null;

  if (loading)
    return <p className="text-center animate_pulse">Chargement...</p>;

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex gap-3 items-center">
          <Users className="h-5 w-5" />
          Joueurs
          <Badge variant="secondary" className="ml-auto gap-2">
            <Hourglass className="h-3 w-3" />
            {players.filter((p) => p.status === "confirmed").length} /{" "}
            {game.total_players}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PlayersTable players={players} />
      </CardContent>
    </Card>
  );
}
