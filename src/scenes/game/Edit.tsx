import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/utils/supabase";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSeason from "../club/lib/useSeasons";
import { Game, categories, getGameDurationInMinutes } from "./lib/game.service";
import useGame from "./lib/useGame";

export default function EditGame() {
  const { id } = useParams();
  const { data: game, isIdle, isLoading, isError } = useGame(Number(id));

  if (isIdle || isLoading) {
    return <div>Chargement...</div>;
  }
  if (isError) {
    return <div>Erreur</div>;
  }
  return <Editor game={game} />;
}

function getInitialFormData(game: Game) {
  return {
    date: game.date.split("T")[0] || "",
    time: new Date(game.date).toLocaleTimeString("fr-FR", {
      timeStyle: "short",
    }),
    durationInMinutes: getGameDurationInMinutes(
      (game.duration as string) || "00:60:00",
    ),
    location: game.location || "",
    total_players: game.total_players || 10,
    category: game.category || "futsal",
    season_id: game.season_id || undefined,
  };
}

function Editor({ game }: { game: Game }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { data: seasons } = useSeason(game.club_id);
  const [data, setData] = useState(getInitialFormData(game));

  async function updateGame() {
    setLoading(true);
    try {
      await supabase
        .from("games")
        .update({
          date: `${data.date}T${data.time}+02:00`,
          duration: data.durationInMinutes * 60,
          location: data.location,
          total_players: data.total_players,
          category: data.category,
          season_id: data.season_id,
        })
        .eq("id", game.id)
        .select("*")
        .single()
        .throwOnError();
      navigate(`/game/${game.id}`);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <Link to={`/game/${game.id}`} className="text-sm text-muted-foreground">
        <ArrowLeft className="mr-2 inline-block h-4 w-4 align-text-top" />
        Retour au match
      </Link>

      <h1 className="mt-6 scroll-m-20 text-2xl font-semibold uppercase tracking-tight">
        Modifier un match
      </h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await updateGame();
        }}
        className="mt-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              name="date"
              type="date"
              value={data.date}
              onChange={(e) => setData({ ...data, date: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="time">Heure</Label>
            <Input
              name="time"
              type="time"
              value={data.time}
              onChange={(e) => setData({ ...data, time: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="season">Saison</Label>
          <Select
            name="season"
            value={data.season_id}
            onValueChange={(season_id) => setData({ ...data, season_id })}
            defaultValue={data.season_id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir une saison" />
            </SelectTrigger>
            <SelectContent>
              {seasons?.map((season) => (
                <SelectItem key={season.id} value={season.id}>
                  {season.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4">
          <Label htmlFor="location" className="">
            Adresse
          </Label>
          <Textarea
            name="location"
            value={data.location}
            onChange={(e) => setData({ ...data, location: e.target.value })}
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="duration">Durée en minutes</Label>
          <Input
            name="duration"
            type="number"
            value={data.durationInMinutes}
            onChange={(e) =>
              setData({ ...data, durationInMinutes: parseInt(e.target.value) })
            }
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Sport</Label>
            <Select
              name="category"
              value={data.category}
              onValueChange={(v) => setData({ ...data, category: v })}
              defaultValue={
                categories.find((c) => c.value === data.category)?.value
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un sport" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="total_players">Nombre de joueurs</Label>
            <Input
              name="total_players"
              type="number"
              value={data.total_players}
              onChange={(e) =>
                setData({
                  ...data,
                  total_players: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full md:order-2"
          >
            Enregistrer
          </Button>
          <Link
            to={`/game/${game.id}`}
            className={buttonVariants({ variant: "secondary" })}
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
