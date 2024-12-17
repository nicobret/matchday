import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Tables } from "types/supabase";
import useUpdateGame from "../lib/game/useUpdateGame";
import { Player } from "../lib/player/player.service";

export default function Result({
  game,
  players,
}: {
  game: Tables<"games">;
  players: Player[];
}) {
  return (
    <Card id="score" className="col-span-2 flex flex-col md:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">Résultat</CardTitle>
      </CardHeader>
      <CardContent>
        {game.score ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-right">
              <p>
                <strong>Domicile</strong>
              </p>
              {players
                .filter((p) => p.team === 0)
                .map((p) => (
                  <p key={p.id}>
                    {p.profile?.firstname} {p.profile?.lastname}
                  </p>
                ))}
            </div>

            <div>
              <p className="text-center text-lg">
                {game.score[0].toString()} - {game.score[1].toString()}
              </p>
            </div>

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
        ) : (
          <p className="text-center text-muted-foreground">Aucun résultat.</p>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        <ScoreDialog game={game} />
      </CardFooter>
    </Card>
  );
}

function ScoreDialog({ game }: { game: Tables<"games"> }) {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState(game.score || [0, 0]);
  const { mutate, isLoading } = useUpdateGame(game.id);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate({ score });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={game.score ? "secondary" : "default"}>
          {game.score ? "Modifier" : "Saisir"}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-96">
        <DialogHeader>
          <DialogTitle>Score</DialogTitle>
          <DialogDescription>
            <form
              onSubmit={handleSubmit}
              className="mt-2 grid grid-cols-2 gap-4"
            >
              <div>
                <Label htmlFor="home">Domicile</Label>
                <Input
                  id="home"
                  type="number"
                  value={score[0]}
                  onChange={(e) =>
                    setScore([parseInt(e.target.value), score[1]])
                  }
                />
              </div>
              <div>
                <Label htmlFor="away">Visiteurs</Label>
                <Input
                  id="away"
                  type="number"
                  value={score[1]}
                  onChange={(e) =>
                    setScore([score[0], parseInt(e.target.value)])
                  }
                />
              </div>
              <Button type="submit" disabled={isLoading} className="col-span-2">
                Enregistrer
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
