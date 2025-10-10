import { Button } from "@/components/ui/button";
import {
  Item,
  ItemContent,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import useUpdateGame from "@/lib/game/useUpdateGame";
import { Player } from "@/lib/player/player.service";
import { useState } from "react";
import { Tables } from "shared/types/supabase";
import NumberInput from "./NumberInput";

export default function ScoreBoard({
  game,
  players,
}: {
  game: Tables<"games">;
  players: Player[];
}) {
  const { mutate, isPending } = useUpdateGame(game.id);
  const [homeScore, setHomeScore] = useState(game.score ? game.score[0] : 0);
  const [awayScore, setAwayScore] = useState(game.score ? game.score[1] : 0);

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>Résultat du match</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex justify-end gap-4">
            <div className="text-right">
              <p>
                <strong>Domicile</strong>
              </p>
              {players
                .filter((p) => p.team === 0)
                .map((p) => (
                  <p key={p.id}>{p.profile?.firstname}</p>
                ))}
            </div>
            <NumberInput value={homeScore} setValue={setHomeScore} />
          </div>
          <div className="flex gap-4">
            <NumberInput value={awayScore} setValue={setAwayScore} />
            <div>
              <p>
                <strong>Visiteurs</strong>
              </p>
              {players
                .filter((p) => p.team === 1)
                .map((p) => (
                  <p key={p.id}>
                    {p.profile?.firstname} {p.profile?.lastname}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </ItemContent>
      <ItemFooter>
        <Button
          onClick={() => mutate({ score: [homeScore, awayScore] })}
          disabled={isPending}
          variant="secondary"
        >
          Enregistrer
        </Button>
      </ItemFooter>
    </Item>
  );
}
