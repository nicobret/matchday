import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    <Card id="events" className="col-span-2 md:col-span-1">
      <CardHeader>
        <CardTitle>Mes actions</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="my-events"
          className="grid grid-cols-3 gap-4"
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
      </CardContent>

      <CardFooter>
        <Button type="submit" disabled={isPending} form="my-events">
          {isPending ? "En cours..." : "Enregistrer"}
        </Button>
      </CardFooter>
    </Card>
  );
}
