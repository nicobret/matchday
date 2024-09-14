import { SessionContext } from "@/components/auth-provider";
import { useContext } from "react";
import { Game, Player } from "../../games.service";
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

  const player = players.find((p) => p.user_id === session?.user.id);

  async function setPlayer(newPlayer: Partial<Player>) {
    setPlayers(
      players.map((p) =>
        p.user_id === session?.user.id ? { ...p, ...newPlayer } : p,
      ),
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <Score
        game={game}
        setGame={(newGame) => setGame({ ...game, ...newGame })}
        players={players}
      />
      {player && <MyEvents player={player} setPlayer={setPlayer} />}
    </div>
  );
}
