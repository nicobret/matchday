import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { Player } from "@/lib/player/player.service";
import useUpdatePlayer from "@/lib/player/useUpdatePlayer";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import NumberInput from "./NumberInput";

export default function MyEvents({ player }: { player: Player }) {
  const [stats, setStats] = useState({
    goals: player.goals || 0,
    assists: player.assists || 0,
    saves: player.saves || 0,
  });
  const { mutate } = useUpdatePlayer(player);
  const client = useQueryClient();
  const timeoutRef = useRef<number | null>(null);

  function handleChange(key: "goals" | "assists" | "saves", value: number) {
    const newStats = { ...stats, [key]: value };
    setStats(newStats);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      mutate(newStats, {
        onSuccess: () => {
          client.invalidateQueries({ queryKey: ["game_stats"] });
        },
      });
    }, 500);
  }

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>Mes actions</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <div className="mx-auto grid w-fit grid-cols-3 gap-2">
          <div className="flex w-12 flex-col items-center gap-2">
            <NumberInput
              value={stats.goals}
              onChange={(v) => handleChange("goals", v)}
            />
            <Label className="text-center leading-snug">Buts</Label>
          </div>
          <div className="flex w-12 flex-col items-center gap-2">
            <NumberInput
              value={stats.assists}
              onChange={(v) => handleChange("assists", v)}
            />
            <Label className="text-center leading-snug">Passes dé</Label>
          </div>
          <div className="flex w-12 flex-col items-center gap-2">
            <NumberInput
              value={stats.saves}
              onChange={(v) => handleChange("saves", v)}
            />
            <Label className="text-center leading-snug">Arrêts</Label>
          </div>
        </div>
      </ItemContent>
    </Item>
  );
}
