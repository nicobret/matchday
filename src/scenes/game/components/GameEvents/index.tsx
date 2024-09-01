import { SessionContext } from "@/components/auth-provider";
import supabase from "@/utils/supabase";
import { useContext, useEffect, useState } from "react";
import { Game, GameEvent, Player } from "../../games.service";
import MyEvents from "./MyEvents";
import Score from "./Score";

export default function GameEvents({
  game,
  setGame,
  players,
  setPlayers,
}: {
  game: Game;
  setGame: (game: Game) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
}) {
  const { session } = useContext(SessionContext);
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);
  console.log("🚀 ~ Events ~ events:", gameEvents);

  const player = players.find((p) => p.user_id === session?.user.id);

  async function setPlayer(newPlayer: Partial<Player>) {
    setPlayers(
      players.map((p) =>
        p.user_id === session?.user.id ? { ...p, ...newPlayer } : p,
      ),
    );
  }

  async function fetchEvents(game_id: number) {
    const { data, error } = await supabase
      .from("game_event")
      .select(`*, games (*), users (*)`)
      .eq("game_id", game_id);
    if (error) {
      console.error("Error fetching events:", error.message);
    }
    if (data) setGameEvents(data);
  }

  useEffect(() => {
    fetchEvents(game.id);
  }, [game.id]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <Score
        game={game}
        setGame={(newGame) => setGame({ ...game, ...newGame })}
      />
      <MyEvents gameEvents={gameEvents} game={game} />
    </div>
  );
}
