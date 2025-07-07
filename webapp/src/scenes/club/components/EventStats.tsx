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

const sortEventsOptions = [
  { value: "goals", label: "Buts" },
  { value: "assists", label: "Passes décisives" },
  { value: "saves", label: "Arrêts" },
];

type SortEventsBy = "goals" | "assists" | "saves";

export default function EventStats({ data }: { data: ClubStatsType[] }) {
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
      <div className="mb-2 mt-4 flex gap-2">
        <div className="grid w-full max-w-36 items-center gap-1.5">
          <Label>Trier par</Label>
          <Select
            name="sortEventsBy"
            value={sortEventsBy}
            onValueChange={(value: SortEventsBy) => setSortEventsBy(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              {sortEventsOptions.map((option) => (
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
