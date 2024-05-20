import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "@/utils/supabase";
import { Club, isMember } from "../club/club.service";
import { User } from "@supabase/supabase-js";
import { SessionContext } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateGame() {
  const clubId = new URLSearchParams(window.location.search).get("clubId");
  console.log("🚀 ~ CreateGame ~ clubId:", clubId);
  const { session } = useContext(SessionContext);
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchClub(id: number) {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("clubs")
        .select("*, members: club_enrolments (*)")
        .eq("id", id)
        .single()
        .throwOnError();
      if (!data) {
        throw new Error("Club not found");
      }
      setClub(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!clubId) return;
    fetchClub(parseInt(clubId));
  }, [clubId]);

  if (loading) {
    return <p className="text-center">Chargement des données...</p>;
  }
  if (!club) {
    return <p className="text-center">Aucun club trouvé</p>;
  }
  if (!session?.user) {
    return (
      <p className="text-center">
        Vous devez être connecté pour créer un match
      </p>
    );
  }
  if (!isMember(session.user, club)) {
    return (
      <p className="text-center">Vous n&apos;êtes pas membre de ce club</p>
    );
  }
  return <GameForm user={session?.user} club={club} />;
}

function GameForm({ user, club }: { user: User; club: Club }) {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [playerCount, setPlayerCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(
    `${club?.address}, ${club?.postcode} ${club?.city}`,
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!date || !time || !playerCount || !location) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from("games")
        .insert({
          creator_id: user.id,
          club_id: club.id,
          date: new Date(`${date} ${time}`).toISOString(),
          total_players: playerCount,
          location: location,
        })
        .select()
        .single()
        .throwOnError();
      if (!data) {
        throw new Error("Impossible de créer le match");
      }
      window.alert("Match créé avec succès");
      navigate(`/game/${data.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <Breadcrumbs
        links={[
          { label: "Accueil", link: "/" },
          { label: club.name || "Club", link: `/club/${club.id}` },
          { label: "Créer un match", link: "#" },
        ]}
      />

      <h2 className="mb-2 mt-6 scroll-m-20 text-3xl font-semibold tracking-tight">
        Créer un match
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="my-6 grid w-full max-w-sm grid-cols-2 gap-3">
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

        <div className="my-6 grid w-full max-w-sm grid-cols-2 gap-3">
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

        <div className="my-6 grid w-full max-w-sm items-center gap-2">
          <Label htmlFor="location">Lieu</Label>
          <Textarea
            id="location"
            placeholder="24, Rue Alexandre Guilmant, 92190 Meudon"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-base"
          />
        </div>

        <div className="flex max-w-sm items-center justify-end gap-3">
          <Button type="button" asChild variant="secondary">
            <Link to={`/clubs/${club.id}`}>Annuler</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            Créer
          </Button>
        </div>
      </form>
    </div>
  );
}
