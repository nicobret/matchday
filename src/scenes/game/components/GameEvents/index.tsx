import { SessionContext } from "@/components/auth-provider";
import { useContext } from "react";
import { Game } from "../../lib/game.service";
import { Player } from "../../lib/player.service";
import MyEvents from "./MyEvents";
import Score from "./Score";

export default function GameEvents({
  game,
  players,
}: {
  game: Game;
  players: Player[];
}) {
  const { session } = useContext(SessionContext);
  const player = players.find((p) => p.user_id === session?.user.id);
  return (
    <div className="grid grid-cols-1 gap-4">
      <Score game={game} players={players} />
      {player && <MyEvents player={player} />}
    </div>
  );
}
