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
import supabase from "@/utils/supabase";
import { useState } from "react";
import { Tables } from "types/supabase";

export default function Result({ game }: { game: Tables<"games"> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">Résultat</CardTitle>
      </CardHeader>
      <CardContent>
        {new Date(game.date) > new Date() ? (
          <p className="text-center text-muted-foreground">
            Le match commence dans{" "}
            {Math.floor(
              (new Date(game.date).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24),
            )}{" "}
            jours.
          </p>
        ) : (
          <div>
            {game.score ? (
              <p className="text-center">
                {game.score[0].toString()} - {game.score[1].toString()}
              </p>
            ) : (
              <p className="text-center">Aucun résultat.</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto flex justify-end">
        {new Date() > new Date(game.date) ? <ScoreDialog game={game} /> : null}
      </CardFooter>
    </Card>
  );
}

function ScoreDialog({ game }: { game: Tables<"games"> }) {
  const [score, setScore] = useState(game.score || [0, 0]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      await supabase.from("games").update({ score }).eq("id", game.id);
    } catch (error) {
      window.alert("Une erreur s'est produite.");
      console.error(error);
    }
    setLoading(false);
    // close Dialog
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="secondary">
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
              <Button type="submit" disabled={loading} className="col-span-2">
                Enregistrer
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
