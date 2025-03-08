import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "wouter";
import useDeleteSeason from "../lib/season/useDeleteSeason";
import useSeasons from "../lib/season/useSeasons";
import UpdateSeasonDialog from "./UpdateSeasonDialog";

export default function SeasonList() {
  const { id } = useParams();
  const { data, isError, isLoading, isIdle } = useSeasons(Number(id));
  const { mutate } = useDeleteSeason();

  function handleDelete(seasonId: string) {
    if (window.confirm("Voulez-vous supprimer cette saison ?")) {
      mutate(seasonId);
    }
  }

  if (isError) {
    return <p>Erreur lors du chargement des saisons</p>;
  }
  if (isIdle || isLoading) {
    return <p>Chargement...</p>;
  }
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((season) => (
          <TableRow key={season.id}>
            <TableCell>{season.name}</TableCell>
            <TableCell className="flex gap-2">
              <UpdateSeasonDialog season={season} />
              <Button
                onClick={() => handleDelete(season.id)}
                variant="secondary"
              >
                Supprimer
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
