import { useToast } from "@/hooks/use-toast";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Shirt } from "lucide-react";
import { Player } from "../../lib/player/player.service";
import Team from "./Team";

const teams: { [key: string]: number | null } = {
  none: null,
  home: 0,
  away: 1,
};

export default function LineupEditor({
  players,
  disabled,
}: {
  players: Player[];
  disabled: boolean;
}) {
  const { toast } = useToast();

  function handleDrop(event: DragEndEvent) {
    if (disabled) {
      window.alert("Vous n'avez pas la permission de modifier l'équipe.");
      return;
    }

    if (!event.over) return;

    const team = teams[event.over.id];
    if (team === undefined) {
      console.error("Team not found");
      return;
    }

    event.active.data.current?.mutate({ team });
    toast({ description: "Modification enregistrée" });
  }

  return (
    <DndContext onDragEnd={handleDrop}>
      <div className="grid gap-4 md:grid-cols-3">
        <Team
          label="Sans équipe"
          icon={<Shirt className="text-muted ml-2 inline-block h-5 w-5" />}
          id="none"
          players={players.filter((p) => p.team === null)}
        />
        <Team
          label="Domicile"
          icon={<Shirt className="text-primary ml-2 inline-block h-5 w-5" />}
          id="home"
          players={players.filter((p) => p.team === 0)}
        />
        <Team
          label="Visiteurs"
          icon={
            <Shirt className="text-secondary-foreground ml-2 inline-block h-5 w-5" />
          }
          id="away"
          players={players.filter((p) => p.team === 1)}
        />
      </div>
    </DndContext>
  );
}
