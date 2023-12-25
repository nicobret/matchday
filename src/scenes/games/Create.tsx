import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createGame } from "./games.service";
import supabaseClient from "@/utils/supabase";

export default function CreateLeague() {
  const params = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [location, setLocation] = useState(
    "24, Rue Alexandre Guilmant, 92190 Meudon"
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { data } = await supabaseClient.auth.getSession();
    const creator_id = data.session?.user.id;
    if (!creator_id) return;
    const club_id = params.get("club");
    if (!club_id) return;

    const game = await createGame({ date, location, creator_id, club_id });
    if (!game) return;

    window.alert("Match créé avec succès");
    navigate(`/games/${game.id}`);
  }

  return (
    <div className="border rounded p-6 space-y-6">
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <Link to="/clubs">
          <p>Matches</p>
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="#">
          <p>Créer un match</p>
        </Link>
      </div>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Créer un match
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
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
          <Label htmlFor="location">Lieu</Label>
          <Textarea
            id="location"
            placeholder="24, Rue Alexandre Guilmant, 92190 Meudon"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <Button type="submit">Créer</Button>
      </form>
    </div>
  );
}
