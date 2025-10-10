import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Player } from "@/lib/player/player.service";
import useUpdatePlayer from "@/lib/player/useUpdatePlayer";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { TablesUpdate } from "shared/types/supabase";

type FormValues = Pick<
  TablesUpdate<"game_player">,
  "goals" | "saves" | "assists"
>;

export default function MyEvents({ player }: { player: Player }) {
  const { mutate, isPending } = useUpdatePlayer(player);
  const client = useQueryClient();
  const { handleSubmit, register } = useForm<FormValues>();

  function onSubmit(data: FormValues) {
    mutate(data, {
      onSuccess: () => client.invalidateQueries({ queryKey: ["game_stats"] }),
    });
  }
  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>Mes actions</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="my-events"
          className="grid gap-4 md:grid-cols-3"
        >
          <div>
            <Label htmlFor="goals">Buts</Label>
            <Input
              type="number"
              {...register("goals")}
              defaultValue={player.goals || 0}
            />
          </div>
          <div>
            <Label htmlFor="assists">Passes dé</Label>
            <Input
              type="number"
              {...register("assists")}
              defaultValue={player.assists || 0}
            />
          </div>
          <div>
            <Label htmlFor="saves">Arrêts</Label>
            <Input
              type="number"
              {...register("saves")}
              defaultValue={player.saves || 0}
            />
          </div>
        </form>
      </ItemContent>
      <ItemActions>
        <Button
          type="submit"
          disabled={isPending}
          form="my-events"
          variant="secondary"
        >
          {isPending ? "En cours..." : "Enregistrer"}
        </Button>
      </ItemActions>
    </Item>
  );
}
