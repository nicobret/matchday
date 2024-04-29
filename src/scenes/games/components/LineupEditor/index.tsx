import supabase from "@/utils/supabase";
import { gamePlayer } from "../../View";
import { DndContext } from "@dnd-kit/core";
import { Shirt } from "lucide-react";
import Team from "./Team";

const teams = { none: null, home: 0, away: 1 };

export default function LineupEditor({
  players,
  setPlayers,
}: {
  players: gamePlayer[];
  setPlayers: React.Dispatch<React.SetStateAction<gamePlayer[]>>;
}) {
  async function handleDrop(event) {
    const team = teams[event.over.id];
    setPlayers(
      players.map((p) => (p.id === event.active.id ? { ...p, team } : p))
    );
    const { error } = await supabase
      .from("game_registrations")
      .update({ team })
      .eq("id", event.active.id);
    if (error) {
      console.error("Error updating player:", error.message);
      setPlayers(players);
    }
  }

  return (
    <DndContext onDragEnd={handleDrop}>
      <div className="grid md:grid-cols-3 gap-4">
        <Team
          label="Disponible"
          icon={<Shirt className="h-5 w-5 text-muted inline-block ml-2" />}
          id="none"
          players={players.filter((p) => p.team === null)}
        />
        <Team
          label="Domicile"
          icon={<Shirt className="h-5 w-5 text-yellow-300 inline-block ml-2" />}
          id="home"
          players={players.filter((p) => p.team === 0)}
        />
        <Team
          label="Visiteurs"
          icon={<Shirt className="h-5 w-5 text-red-400 inline-block ml-2" />}
          id="away"
          players={players.filter((p) => p.team === 1)}
        />
      </div>
    </DndContext>
  );
}
