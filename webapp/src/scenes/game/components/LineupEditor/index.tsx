import { useToast } from "@/hooks/use-toast";
import { Player, updatePlayer } from "@/lib/player/player.service";
import { updatePlayerListCache } from "@/lib/player/playerCacheService";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Shirt } from "lucide-react";
import { TablesUpdate } from "shared/types/supabase";
import Team from "./Team";

type LineUpEditorProps = {
  gameId: number;
  players: Player[];
  disabled: boolean;
};

type PlayerMutationArguments = {
  playerId: string;
  payload: Pick<TablesUpdate<"game_player">, "team">;
};

const teams: { [key: string]: number | null } = {
  none: null,
  home: 0,
  away: 1,
};

export default function LineupEditor({
  gameId,
  players,
  disabled,
}: LineUpEditorProps) {
  const { toast } = useToast();
  const client = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({ playerId, payload }: PlayerMutationArguments) =>
      updatePlayer(playerId, payload),

    onMutate: ({ playerId, payload }: PlayerMutationArguments) =>
      updatePlayerListCache(client, {
        id: playerId,
        game_id: gameId,
        ...payload,
      }),
  });

  function handleDrop({ active, over }: DragEndEvent) {
    if (disabled) {
      window.alert("Vous n'avez pas la permission de modifier l'équipe.");
      return;
    }
    if (!over) {
      console.error("Invalid drop event");
      return;
    }
    const team = teams[over.id];
    if (team === undefined) {
      console.error("Team not found");
      return;
    }
    mutate(
      { playerId: active.id as string, payload: { team } },
      { onSuccess: () => toast({ description: "Modification enregistrée" }) },
    );
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
