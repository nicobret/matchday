import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Club } from "@/lib/club/club.service";
import useGames from "@/lib/game/useGames";
import { useQueryState } from "nuqs";
import { Link } from "wouter";

export default function ClubHistory({ club }: { club: Club }) {
  const seasons = club.seasons || [];

  const seasonOptions = [
    ...seasons
      .sort((a, b) => b.name.localeCompare(a.name))
      .map((season) => ({ label: season.name, value: season.id })),
    { label: "Hors saison", value: "none" },
  ];

  const [selectedSeason, setSelectedSeason] = useQueryState("season", {
    defaultValue: seasonOptions[0].value,
    clearOnDefault: false,
  });

  const { data: games, isPending } = useGames({
    clubId: club.id,
    when: "past",
    seasonId: selectedSeason,
  });

  if (isPending) {
    return <p className="text-center">Chargement...</p>;
  }
  return (
    <div className="mt-2">
      <div className="grid gap-2">
        <Label>Saison</Label>
        <Select
          onValueChange={(value) => setSelectedSeason(value as string)}
          defaultValue={selectedSeason}
        >
          <SelectTrigger className="w-fit">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {seasonOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isPending ? (
        <p className="text-center">Chargement...</p>
      ) : games?.length ? (
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .map((game) => (
                <TableRow key={game.id}>
                  <TableCell>
                    <Link
                      to={`~/game/${game.id}`}
                      className="text-primary underline underline-offset-4"
                    >
                      {new Date(game.date).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {game.score && game.score.length === 2
                      ? game.score[0].toString() +
                        " - " +
                        game.score[1].toString()
                      : "N/A"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      ) : (
        <p className="mt-4 text-center">Aucun match joué.</p>
      )}
    </div>
  );
}
