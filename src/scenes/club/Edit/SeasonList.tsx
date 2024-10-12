import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { queryClient } from "@/lib/react-query";
import supabase from "@/utils/supabase";
import CreateSeasonDialog from "./CreateSeasonDialog";
import UpdateSeasonDialog from "./UpdateSeasonDialog";

export default function SeasonList({
  clubId,
  seasons,
}: {
  clubId: number;
  seasons: any;
}) {
  async function handleDelete(seasonId: string) {
    if (!window.confirm("Voulez-vous vraiment supprimer cette saison ?")) {
      return;
    }
    try {
      await supabase.from("season").delete().eq("id", seasonId).throwOnError();
      queryClient.invalidateQueries("seasons");
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saisons du club</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {seasons.map((season: any) => (
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
      </CardContent>
      <CardFooter>
        <CreateSeasonDialog clubId={clubId} />
      </CardFooter>
    </Card>
  );
}
