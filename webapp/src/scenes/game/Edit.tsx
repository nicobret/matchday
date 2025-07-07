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
import { useToast } from "@/hooks/use-toast";
import { Game } from "@/lib/club/club.service";
import { categories, getGameDurationInMinutes } from "@/lib/game/gameService";
import useGame from "@/lib/game/useGame";
import useUpdateGame from "@/lib/game/useUpdateGame";
import useSeasons from "@/lib/season/useSeasons";
import { fromZonedTime } from "date-fns-tz";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { TablesUpdate } from "shared/types/supabase";
import { Link, useLocation, useParams } from "wouter";

type FormValues = {
  date: string;
  time: string;
  total_players: number;
  location: string;
  durationInMinutes: number;
  category: string;
  season_id?: string;
};

export default function EditGame() {
  const { id } = useParams();
  const { data, isPending, isError } = useGame(Number(id));

  if (isPending) {
    return <div>Chargement...</div>;
  }
  if (isError) {
    return <div>Erreur</div>;
  }
  return <Editor game={data} />;
}

function getFormValuesFromData(game: Game) {
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

function getPayloadFromFormValues(data: FormValues): TablesUpdate<"games"> {
  return {
    date: fromZonedTime(
      `${data.date}T${data.time}`,
      "Europe/Paris",
    ).toISOString(),
    duration: data.durationInMinutes * 60,
    location: data.location,
    total_players: data.total_players,
    category: data.category,
    season_id: data.season_id?.toString(),
  };
}

function Editor({ game }: { game: Game }) {
  const [_location, navigate] = useLocation();
  const { data: seasons } = useSeasons(game.club_id);
  const initialValues = getFormValuesFromData(game);
  const { mutate, isPending } = useUpdateGame(game.id);
  const { toast } = useToast();
  const { register, handleSubmit, setValue } = useForm<FormValues>();

  function onSubmit(data: FormValues) {
    const payload = getPayloadFromFormValues(data);
    mutate(payload, {
      onSuccess: () => {
        toast({ description: "Match mis à jour" });
        navigate(`~/game/${game.id}`);
      },
    });
  }

  function handleDelete() {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce match ?")) {
      mutate(
        { status: "deleted" },
        { onSuccess: () => navigate(`~/club/${game.club_id}`) },
      );
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <Link to={`~/game/${game.id}`} className="text-muted-foreground text-sm">
        <ArrowLeft className="mr-2 inline-block h-4 w-4 align-text-top" />
        Retour au match
      </Link>

      <h1 className="mt-6 scroll-m-20 text-2xl font-semibold uppercase tracking-tight">
        Modifier un match
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              {...register("date")}
              defaultValue={initialValues.date}
              required
            />
          </div>
          <div>
            <Label htmlFor="time">Heure</Label>
            <Input
              type="time"
              {...register("time")}
              defaultValue={initialValues.time}
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="season">Saison</Label>
          <Select
            onValueChange={(value) => setValue("season_id", value)}
            defaultValue={initialValues.season_id}
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
            {...register("location")}
            defaultValue={initialValues.location}
            required
          />
        </div>

        <div className="mt-4">
          <Label htmlFor="duration">Durée en minutes</Label>
          <Input
            type="number"
            {...register("durationInMinutes")}
            defaultValue={initialValues.durationInMinutes}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Sport</Label>
            <Select
              {...register("category")}
              defaultValue={
                categories.find((c) => c.value === initialValues.category)
                  ?.value
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
              type="number"
              {...register("total_players")}
              defaultValue={initialValues.total_players}
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full md:order-2"
          >
            Enregistrer
          </Button>
          <Link
            to={`~/game/${game.id}`}
            className={buttonVariants({ variant: "secondary" })}
          >
            Annuler
          </Link>
        </div>
      </form>

      <h1 className="mt-12 scroll-m-20 text-2xl font-semibold uppercase tracking-tight">
        Supprimer le match
      </h1>

      <Button onClick={handleDelete} variant="destructive" className="mt-4">
        Supprimer le match
      </Button>
    </div>
  );
}
