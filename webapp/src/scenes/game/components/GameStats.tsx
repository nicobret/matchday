import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
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
import useGameStats from "@/lib/game/useGameStats";
import { useState } from "react";

export default function GameStats({ gameId }: { gameId: number }) {
  const [team, setTeam] = useState("all");
  const [sortby, setSortby] = useState<"goals" | "assists" | "saves">("goals");
  const { data, isError, isPending } = useGameStats({ gameId, sortby });

  if (isPending) {
    return <div>Chargement...</div>;
  }
  if (isError) {
    return <div>Erreur</div>;
  }
  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>Actions des joueurs</ItemTitle>
      </ItemHeader>
      <ItemContent>
        {data.length ? (
          <>
            <div className="mb-2 flex gap-2">
              <div className="grid w-full max-w-36 items-center gap-1.5">
                <Label>Trier par</Label>
                <Select
                  name="sortby"
                  value={sortby}
                  onValueChange={(value: "goals" | "assists" | "saves") =>
                    setSortby(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="goals">Buts</SelectItem>
                    <SelectItem value="assists">Passes décisives</SelectItem>
                    <SelectItem value="saves">Arrêts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid w-full max-w-36 items-center gap-1.5">
                <Label>Equipe</Label>
                <Select
                  name="team"
                  value={team}
                  onValueChange={(value: "home" | "away" | "all") =>
                    setTeam(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="home">Domicile</SelectItem>
                    <SelectItem value="away">Extérieur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prénom</TableHead>
                    <TableHead>Equipe</TableHead>
                    <TableHead>Buts</TableHead>
                    <TableHead>Passes décisives</TableHead>
                    <TableHead>Arrêts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data
                    .filter((row) => !!row.user_id)
                    .filter((row) =>
                      team === "all" ? true : row.user_team === team,
                    )
                    .map((row) => {
                      return (
                        <TableRow key={row.user_id}>
                          <TableCell>{row.firstname}</TableCell>
                          <TableCell>{row.user_team}</TableCell>
                          <TableCell>{row.goals}</TableCell>
                          <TableCell>{row.assists}</TableCell>
                          <TableCell>{row.saves}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-center">
            Afin d'afficher la liste des actions, saisissez un score pour le
            match.
          </p>
        )}
      </ItemContent>
    </Item>
  );
}
