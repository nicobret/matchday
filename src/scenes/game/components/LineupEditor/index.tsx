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

    event.active.data.current?.mutate(
      { team },
      {
        onSuccess: () => {
          console.log("Player moved to team", team);
        },
      },
    );
    toast({ description: "Modification enregistrée" });
  }

  return (
    <DndContext onDragEnd={handleDrop}>
      <div className="${isLoading grid gap-4 md:grid-cols-3">
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
      <p className="mt-4 text-muted-foreground">Enregistrement automatique.</p>
    </DndContext>
  );
}
