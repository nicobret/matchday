import supabase from "@/utils/supabase";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Shirt } from "lucide-react";
import { Player } from "../../games.service";
import Team from "./Team";

const teams: { [key: string]: number | null } = {
  none: null,
  home: 0,
  away: 1,
};

export default function LineupEditor({
  players,
  setPlayers,
  disabled,
}: {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  disabled: boolean;
}) {
  async function handleDrop(event: DragEndEvent) {
    if (disabled) {
      window.alert("Vous n'avez pas la permission de modifier l'équipe.");
      return;
    }

    if (!event.over) return;

    const team = teams[event.over.id];
    setPlayers(
      players.map((p) => (p.id === event.active.id ? { ...p, team } : p)),
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
      <div className="grid gap-4 md:grid-cols-3">
        <Team
          label="Sans équipe"
          icon={<Shirt className="ml-2 inline-block h-5 w-5 text-muted" />}
          id="none"
          players={players.filter((p) => p.team === null)}
        />
        <Team
          label="Domicile"
          icon={<Shirt className="ml-2 inline-block h-5 w-5 text-primary" />}
          id="home"
          players={players.filter((p) => p.team === 0)}
        />
        <Team
          label="Visiteurs"
          icon={
            <Shirt className="ml-2 inline-block h-5 w-5 text-secondary-foreground" />
          }
          id="away"
          players={players.filter((p) => p.team === 1)}
        />
      </div>
    </DndContext>
  );
}
