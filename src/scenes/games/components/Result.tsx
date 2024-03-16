import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown } from "lucide-react";
import { Tables } from "types/supabase";

export default function Result({ game }: { game: Tables<"games"> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-3 items-center">
          <Crown className="h-5 w-5" />
          Résultat
        </CardTitle>
      </CardHeader>
      <CardContent>
        {new Date(game.date) > new Date() ? (
          <p className="text-center text-muted-foreground">
            Le match commence dans{" "}
            {Math.floor(
              (new Date(game.date).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            jours.
          </p>
        ) : game.score ? (
          <p className="text-center">
            {game.score[0].toString()} - {game.score[1].toString()}
          </p>
        ) : (
          <p className="text-center">Aucun résultat.</p>
        )}
      </CardContent>
    </Card>
  );
}
