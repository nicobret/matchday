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
import { Crown } from "lucide-react";
import { useQueryState } from "nuqs";
import useClubStats, { ClubStatsType } from "../lib/club/useClubStats";

export default function ClubStats({ clubId }: { clubId: number }) {
  const { data, isError, isLoading, isIdle } = useClubStats(clubId);

  if (isIdle) {
    return <div>Selectionnez un club</div>;
  }
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  if (isError) {
    return <div>Erreur</div>;
  }
  return (
    <div className="mt-4 grid gap-8 md:grid-cols-2">
      <Wins data={data} />
      <Events data={data} />
    </div>
  );
}

type SortWinsBy = "games" | "wins" | "winstreak" | "winrate";

function Wins({ data }: { data: ClubStatsType[] }) {
  const [sortWinsBy, setSortWinsBy] = useQueryState<SortWinsBy>("sortWinsBy", {
    defaultValue: "wins",
    clearOnDefault: false,
    parse: (value) => value as SortWinsBy,
  });

  return (
    <div className="overflow-x-auto">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Victoires
      </h3>
      <div className="mt-4 mb-2 flex gap-2">
        <div className="grid w-full max-w-36 items-center gap-1.5">
          <Label>Trier par</Label>
          <Select
            name="sortEventsBy"
            value={sortWinsBy}
            onValueChange={(value: "games" | "wins" | "winstreak") =>
              setSortWinsBy(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="games">Matchs</SelectItem>
              <SelectItem value="wins">Victoires</SelectItem>
              <SelectItem value="winstreak">Série de victoires</SelectItem>
              <SelectItem value="winrate">Pourcentage de victoires</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableRow></TableRow>
            <TableHead>Prénom</TableHead>
            <TableHead>Matchs</TableHead>
            <TableHead>Victoires</TableHead>
            <TableHead>Série</TableHead>
            <TableHead>Pourcentage</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data
            .sort(
              (a: ClubStatsType, b: ClubStatsType) =>
                b[sortWinsBy] - a[sortWinsBy],
            )
            .map((row, index) => {
              return (
                <TableRow key={row.user_id}>
                  <TableCell className="text-center">
                    {index + 1 === 1 ? (
                      <Crown className="text-primary inline-block" />
                    ) : (
                      <span className="text-muted-foreground">{index + 1}</span>
                    )}
                  </TableCell>
                  <TableCell>{row.firstname}</TableCell>
                  <TableCell>{row.games}</TableCell>
                  <TableCell>{row.wins}</TableCell>
                  <TableCell>{row.winstreak}</TableCell>
                  <TableCell>{row.winrate} %</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}

type SortEventsBy = "goals" | "assists" | "saves";

function Events({ data }: { data: ClubStatsType[] }) {
  const [sortEventsBy, setSortEventsBy] = useQueryState<SortEventsBy>(
    "sortEventsBy",
    {
      defaultValue: "goals",
      clearOnDefault: false,
      parse: (value) => value as SortEventsBy,
    },
  );

  return (
    <div className="overflow-x-auto">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Actions
      </h3>
      <div className="mt-4 mb-2 flex gap-2">
        <div className="grid w-full max-w-36 items-center gap-1.5">
          <Label>Trier par</Label>
          <Select
            name="sortEventsBy"
            value={sortEventsBy}
            onValueChange={(value: "goals" | "assists" | "saves") =>
              setSortEventsBy(value)
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
      </div>

      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableRow></TableRow>
            <TableHead>Prénom</TableHead>
            <TableHead>Buts</TableHead>
            <TableHead>Passes décisives</TableHead>
            <TableHead>Arrêts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data
            .sort((a, b) => b[sortEventsBy] - a[sortEventsBy])
            .map((row, index) => {
              return (
                <TableRow key={row.user_id}>
                  <TableCell className="text-center">
                    {index + 1 === 1 ? (
                      <Crown className="text-primary inline-block" />
                    ) : (
                      <span className="text-muted-foreground">{index + 1}</span>
                    )}
                  </TableCell>
                  <TableCell>{row.firstname}</TableCell>
                  <TableCell>{row.goals}</TableCell>
                  <TableCell>{row.assists}</TableCell>
                  <TableCell>{row.saves}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
