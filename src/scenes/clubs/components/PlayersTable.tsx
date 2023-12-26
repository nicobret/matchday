import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import supabaseClient from "@/utils/supabase";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export type playerType = {
  id: number;
  role: string;
  created_at: Date;
  profile: {
    firstname: string;
    lastname: string;
    status: string;
  };
};

export default function PlayersTable() {
  const [players, setPlayers] = useState<playerType[]>([]);
  console.log(
    "🚀 ~ file: PlayersTable.tsx:23 ~ PlayersTable ~ players:",
    players
  );
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();

  async function getPlayers() {
    setLoading(true);
    const { data, error } = await supabaseClient
      .from("club_enrolments")
      .select(
        "id, created_at, role, profile:users (firstname, lastname, status)"
      )
      .eq("club_id", id);

    if (error) {
      console.error(error);
      return;
    }

    setPlayers(data as unknown as playerType[]);
    setLoading(false);
  }

  useEffect(() => {
    getPlayers();
  }, []);

  if (loading)
    return <p className="text-center animate_pulse">Chargement...</p>;

  if (players)
    return (
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Prénom</TableHead>
            <TableHead>Membre depuis</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell>{player.profile.lastname}</TableCell>
              <TableCell>{player.profile.firstname}</TableCell>
              <TableCell>
                {new Date(player.created_at).toLocaleDateString("fr-FR")}
              </TableCell>
              <TableCell>{player.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
}
