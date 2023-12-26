import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { gameType } from "@/scenes/games/View";
import supabaseClient from "@/utils/supabase";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function GamesTable() {
  const [games, setGames] = useState<gameType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();

  async function getGames() {
    setLoading(true);
    const { data, error } = await supabaseClient
      .from("games")
      .select(
        `
          id,
          created_at,
          date,
          location,
          status,
          club:club_id (id, name),
          creator:creator_id (id, firstname, lastname, avatar, status)
        `
      )
      .eq("club_id", id)
      .order("date", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setGames(data as unknown as gameType[]);
    setLoading(false);
  }

  useEffect(() => {
    getGames();
  }, []);

  if (loading)
    return <p className="text-center animate_pulse">Chargement...</p>;

  if (games)
    return (
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Adversaire</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Créateur</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game) => (
            <TableRow key={game.id}>
              <TableCell>
                <Link to={`/games/${game.id}`}>
                  {new Date(game.date).toLocaleDateString("fr-FR", {
                    dateStyle: "long",
                  })}
                </Link>
              </TableCell>
              <TableCell>N/A</TableCell>
              <TableCell>{game.status}</TableCell>
              <TableCell>{game.creator.firstname}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );

  return <p>Aucun match.</p>;
}
