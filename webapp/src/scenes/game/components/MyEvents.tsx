import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Player } from "@/lib/player/player.service";
import useUpdatePlayer from "@/lib/player/useUpdatePlayer";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import NumberInput from "./NumberInput";

export default function MyEvents({ player }: { player: Player }) {
  const [goals, setsGoals] = useState(player.goals || 0);
  const [assists, setAssists] = useState(player.assists || 0);
  const [saves, setSaves] = useState(player.saves || 0);
  const { mutate, isPending } = useUpdatePlayer(player);
  const client = useQueryClient();

  function handleSubmit() {
    mutate(
      { goals, assists, saves },
      {
        onSuccess: () => client.invalidateQueries({ queryKey: ["game_stats"] }),
      },
    );
  }

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>Mes actions</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <div className="mx-auto grid w-fit grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-2">
            <NumberInput value={goals} setValue={setsGoals} />
            <Label>Buts</Label>
          </div>
          <div className="flex flex-col items-center gap-2">
            <NumberInput value={assists} setValue={setAssists} />
            <Label>Passes dé</Label>
          </div>
          <div className="flex flex-col items-center gap-2">
            <NumberInput value={saves} setValue={setSaves} />
            <Label>Arrêts</Label>
          </div>
        </div>
      </ItemContent>
      <ItemFooter>
        <Button onClick={handleSubmit} disabled={isPending} variant="secondary">
          {isPending ? "En cours..." : "Enregistrer"}
        </Button>
      </ItemFooter>
    </Item>
  );
}
