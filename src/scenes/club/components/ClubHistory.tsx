import { buttonVariants } from "@/components/ui/button";
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
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { Club } from "../lib/club.service";
import useGames from "../lib/useGames";

export default function ClubHistory({ club }: { club: Club }) {
  const seasons = club.seasons || [];

  const seasonOptions = [
    ...seasons
      .sort((a, b) => b.name.localeCompare(a.name))
      .map((season) => ({ label: season.name, value: season.id })),
    { label: "Hors saison", value: "none" },
  ];

  const [selectedSeason, setSelectedSeason] = useState<string>(
    seasonOptions[0].value,
  );

  const { data: games, isLoading } = useGames(club.id, "past", selectedSeason);

  if (isLoading) {
    return <p className="text-center">Chargement...</p>;
  }
  return (
    <div className="mt-2">
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

      {isLoading ? (
        <p className="text-center">Chargement...</p>
      ) : games?.length ? (
        <Table className="mt-4 border">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {games.map((game) => (
              <TableRow key={game.id}>
                <TableCell>
                  {new Date(game.date).toLocaleDateString("fr-FR")}
                </TableCell>
                <TableCell>
                  {game.score && game.score.length === 2
                    ? game.score[0].toString() +
                      " - " +
                      game.score[1].toString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Link
                    to={`~/game/${game.id}`}
                    className={
                      buttonVariants({ variant: "secondary" }) + "gap-2"
                    }
                  >
                    Voir
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-center">Aucun match joué.</p>
      )}
    </div>
  );
}
