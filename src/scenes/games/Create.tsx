import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createGame } from "./games.service";
import { useClubs } from "../clubs/useClubs";
import useStore from "@/utils/zustand";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { SelectValue } from "@radix-ui/react-select";

export default function CreateGame() {
  const clubId = new URLSearchParams(window.location.search).get("clubId");
  const { session } = useStore();
  const { club } = useClubs(clubId || "");

  if (!club) return <p className="text-center">Aucun club trouvé</p>;

  if (!session?.user)
    return (
      <p className="text-center">
        Vous devez être connecté pour créer un match
      </p>
    );

  if (!club.members.map((m: any) => m.id).includes(session.user.id))
    return <p className="text-center">Vous n'êtes pas membre de ce club</p>;

  return <GameForm user={session.user} club={club} />;
}

function GameForm({ user, club }: { user: any; club: any }) {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [playerCount, setPlayerCount] = useState(10);
  const [location, setLocation] = useState(
    `${club?.address}, ${club?.postcode} ${club?.city}`
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!date || !time || !playerCount || !location) return;
    const dateString = new Date(`${date} ${time}`).toISOString();

    const game = await createGame({
      date: dateString,
      location,
      total_players: playerCount,
      creator_id: user.id,
      club_id: club.id,
    });
    if (!game) return;

    window.alert("Match créé avec succès");
    navigate(`/games/${game.id}`);
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Link to="/">Accueil</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/games">Matches</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="#">Créer un match</Link>
      </div>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-6 mb-2">
        Créer un match
      </h2>

      <form onSubmit={onSubmit}>
        <div className="grid w-full max-w-sm grid-cols-2 gap-3 my-6">
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="sportType">Sport</Label>
            <Select name="sportType" disabled>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="football">Football</SelectItem>
                <SelectItem value="futsal">Futsal</SelectItem>
                <SelectItem value="basketball">Basketball</SelectItem>
                <SelectItem value="handball">Handball</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="playerCount">Nombre de joueurs</Label>
            <Input
              type="number"
              id="playerCount"
              value={playerCount}
              onChange={(e) => setPlayerCount(parseInt(e.target.value))}
              className="text-base"
            />
          </div>
        </div>

        <div className="grid w-full max-w-sm grid-cols-2 gap-3 my-6">
          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="date">Date du match</Label>
            <Input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-2">
            <Label htmlFor="time">Heure du match</Label>
            <Input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div className="grid w-full max-w-sm items-center gap-2 my-6">
          <Label htmlFor="location">Lieu</Label>
          <Textarea
            id="location"
            placeholder="24, Rue Alexandre Guilmant, 92190 Meudon"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-base"
          />
        </div>

        <div className="flex items-center gap-3 max-w-sm justify-end">
          <Button type="button" asChild variant="secondary">
            <Link to={`/clubs/${club.id}`}>Annuler</Link>
          </Button>
          <Button type="submit">Créer</Button>
        </div>
      </form>
    </div>
  );
}
