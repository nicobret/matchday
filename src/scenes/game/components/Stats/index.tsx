import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";
import { Game, GameEvent } from "../../games.service";
import AllEvents from "./AllEvents";
import MyEvents from "./MyEvents";
import Score from "./Score";

export default function Stats({
  game,
  setGame,
}: {
  game: Game;
  setGame: (game: Game) => void;
}) {
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);
  console.log("🚀 ~ Events ~ events:", gameEvents);

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
      <MyEvents game={game} />
      <AllEvents gameEvents={gameEvents} />
    </div>
  );
}
