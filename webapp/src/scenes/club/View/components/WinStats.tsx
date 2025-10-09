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
import { ClubStatsType } from "@/lib/club/useClubStats";
import { Crown } from "lucide-react";
import { useQueryState } from "nuqs";

const sortWinsOptions = [
  { value: "games", label: "Matchs" },
  { value: "wins", label: "Victoires" },
  { value: "winstreak", label: "Série de victoires" },
  { value: "winrate", label: "Pourcentage de victoires" },
];

type SortWinsBy = "games" | "wins" | "winstreak" | "winrate";

export default function WinStats({ data }: { data: ClubStatsType[] }) {
  const [sortWinsBy, setSortWinsBy] = useQueryState<SortWinsBy>("sortWinsBy", {
    defaultValue: "wins",
    clearOnDefault: false,
    parse: (value) => value as SortWinsBy,
  });

  return (
    <div className="overflow-x-auto">
      <h2 className="font-new-amsterdam scroll-m-20 text-3xl">Victoires</h2>
      <div className="mb-2 mt-4 flex gap-2">
        <div className="grid w-full max-w-36 items-center gap-1.5">
          <Label>Trier par</Label>
          <Select
            name="sortEventsBy"
            value={sortWinsBy}
            onValueChange={(value: SortWinsBy) => setSortWinsBy(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              {sortWinsOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
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
