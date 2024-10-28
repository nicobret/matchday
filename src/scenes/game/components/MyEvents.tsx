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
import { queryClient } from "@/lib/react-query";
import { Player } from "../lib/player/player.service";
import useUpdatePlayer from "../lib/player/useUpdatePlayer";

export default function MyEvents({ player }: { player: Player }) {
  const { mutate, isLoading } = useUpdatePlayer(player.game_id);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const goals = parseInt(form.get("goals") as string) || 0;
    const assists = parseInt(form.get("assists") as string) || 0;
    const saves = parseInt(form.get("saves") as string) || 0;

    mutate(
      { id: player.id, goals, assists, saves },
      { onSuccess: () => queryClient.invalidateQueries("game_stats") },
    );
  }

  return (
    <Card id="events" className="col-span-2 md:col-span-1">
      <CardHeader>
        <CardTitle>Mes actions</CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          id="my-events"
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <Label htmlFor="goals">Buts</Label>
            <Input
              id="goals"
              name="goals"
              type="number"
              defaultValue={player.goals || 0}
            />
          </div>
          <div>
            <Label htmlFor="assists">Passes dé</Label>
            <Input
              id="assists"
              name="assists"
              type="number"
              defaultValue={player.assists || 0}
            />
          </div>
          <div>
            <Label htmlFor="saves">Arrêts</Label>
            <Input
              id="saves"
              name="saves"
              type="number"
              defaultValue={player.saves || 0}
            />
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <Button type="submit" disabled={isLoading} form="my-events">
          {isLoading ? "En cours..." : "Enregistrer"}
        </Button>
      </CardFooter>
    </Card>
  );
}
