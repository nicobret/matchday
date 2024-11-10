import { SessionContext } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useContext } from "react";
import { Player, translateStatus } from "../lib/player/player.service";
import useUpdatePlayer from "../lib/player/useUpdatePlayer";

export default function PlayerTable({ players }: { players: Player[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prénom</TableHead>
                <TableHead>Inscription</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
                )
                .map((player) => (
                  <Row key={player.id} player={player} />
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ player }: { player: Player }) {
  const { mutate, isLoading } = useUpdatePlayer(player);
  const { session } = useContext(SessionContext);
  const enabled = !player.user_id || session?.user?.id === player.user_id;

  return (
    <TableRow>
      <TableCell>{player.name || player.profile?.firstname}</TableCell>
      <TableCell>{new Date(player.created_at).toLocaleDateString()}</TableCell>
      <TableCell>
        <Select
          name="status"
          value={player.status || undefined}
          onValueChange={(status) => mutate({ status })}
          disabled={!enabled || isLoading}
        >
          <SelectTrigger>
            <SelectValue>
              {translateStatus(player.status || undefined)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="confirmed">Confirmé</SelectItem>
            <SelectItem value="cancelled">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
    </TableRow>
  );
}
