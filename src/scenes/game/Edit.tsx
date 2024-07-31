import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import supabase from "@/utils/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  Game,
  categories,
  fetchGame,
  getGameDurationInMinutes,
} from "./games.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditGame() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState<Game>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      return navigate("/");
    }
    fetchGame(parseInt(id))
      .then((data) => {
        if (data) setGame(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!game) {
    return <div>Game not found</div>;
  }

  return <Editor game={game} loading={loading} setLoading={setLoading} />;
}

function Editor({
  game,
  loading,
  setLoading,
}: {
  game: Game;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) {
  const [data, setData] = useState({
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
  });
  const navigate = useNavigate();

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
    <div className="p-4">
      <Breadcrumbs
        links={[
          { label: game.club?.name || "", link: `/club/${game.club?.id}` },
          {
            label: `Match du ${new Date(game.date).toLocaleDateString("fr-FR", {
              dateStyle: "long",
            })}`,
            link: `/game/${game.id}`,
          },
          { label: "Edition", link: `/game/${game.id}/edit` },
        ]}
      />

      <h1 className="mt-6 scroll-m-20 text-2xl font-semibold tracking-tight">
        Edit Game
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

        <div className="mt-8 grid grid-cols-2 gap-4">
          <Link
            to={`/game/${game.id}`}
            className={buttonVariants({ variant: "secondary" })}
          >
            Retour
          </Link>

          <Button type="submit" disabled={loading}>
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
}
