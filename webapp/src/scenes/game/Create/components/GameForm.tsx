import { Button } from "@/components/ui/button";
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
import useAuth from "@/lib/auth/useAuth";
import useClub from "@/lib/club/useClub";
import { categories } from "@/lib/game/gameService";
import useCreateGame from "@/lib/game/useCreateGame";
import { useMembers } from "@/lib/member/useMembers";
import { fromZonedTime } from "date-fns-tz";
import { Controller, useForm } from "react-hook-form";
import type { TablesInsert } from "shared/types/supabase";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";

type Payload = TablesInsert<"games">;
type FormValues = {
  date: string;
  time: string;
  total_players: number;
  location: string;
  status: string;
  duration: number;
  category: string;
  season_id?: string;
};

export default function GameForm({ clubId }: { clubId: number }) {
  const { data: club, isPending, isError } = useClub(clubId);
  const { isMember } = useMembers(clubId);
  const [_location, navigate] = useLocation();
  const { mutate, isPending: isCreationPending } = useCreateGame();
  const { register, handleSubmit, control } = useForm<FormValues>();
  const { session } = useAuth();

  if (!session?.user) {
    return <p className="text-center">Vous devez être connecté</p>;
  }
  if (isPending) {
    return <p className="text-center">Chargement des données...</p>;
  }
  if (isError) {
    return <p className="text-center">Une erreur s'est produite</p>;
  }
  if (!isMember) {
    return (
      <p className="text-center">Vous n&apos;êtes pas membre de ce club</p>
    );
  }

  const seasons = club.seasons || [];
  const seasonOptions = [
    ...seasons
      .sort((a, b) => b.name.localeCompare(a.name))
      .map((season) => ({ label: season.name, value: season.id })),
    { label: "Hors saison", value: "none" },
  ];

  function onSubmit(data: FormValues) {
    if (!session?.user || !club) return;

    const formattedDate = fromZonedTime(
      `${data.date}T${data.time}`,
      "Europe/Paris",
    ).toISOString();

    const payload: Payload = {
      date: formattedDate,
      total_players: data.total_players,
      location: data.location,
      status: "published",
      duration: data.duration * 60,
      category: data.category || "",
      season_id: data.season_id,
      club_id: club.id,
      creator_id: session?.user.id,
    };

    mutate(payload, {
      onSuccess: (game) => {
        toast.success("Match créé avec succès");
        navigate(`~/game/${game?.id}`);
      },
    });
  }

  return (
    <form
      id="game-creator"
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-8 max-w-lg"
    >
      <div className="my-6 grid w-full grid-cols-2 items-start gap-3">
        <div>
          <div className="mb-1 grid w-full items-center gap-2">
            <Label htmlFor="club">Club</Label>
            <Input
              type="text"
              id="club"
              value={club?.name || ""}
              disabled={true}
              className="cursor-not-allowed"
            />
          </div>
        </div>
        <div>
          <div className="mb-1 grid w-full items-center gap-2">
            <Label htmlFor="season">Saison</Label>
            <Controller
              name="season_id"
              control={control}
              defaultValue={seasonOptions[0].value}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {seasonOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <Link
            to={`~/club/${club.id}/edit#seasons`}
            className="text-primary text-sm"
          >
            Ajouter une saison
          </Link>
        </div>
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="category">Sport</Label>
          <Select
            {...register("category")}
            defaultValue="football"
            disabled={true}
          >
            <SelectTrigger className="w-full">
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

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="playerCount">Nombre de joueurs</Label>
          <Input
            type="number"
            {...register("total_players", { required: true, min: 0 })}
            defaultValue={10}
          />
        </div>
      </div>

      <div className="my-6 grid w-full grid-cols-2 gap-3">
        <div className="grid w-full items-center gap-2">
          <Label htmlFor="date">Date du match</Label>
          <Input type="date" {...register("date", { required: true })} />
        </div>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="time">Heure du match</Label>
          <Input type="time" {...register("time", { required: true })} />
        </div>
      </div>

      <div className="grid w-full items-center gap-2">
        <Label htmlFor="duration">Durée en minutes</Label>
        <Input
          type="number"
          {...register("duration", { required: true, min: 0 })}
          defaultValue={60}
        />
      </div>

      <div className="my-6 grid w-full items-center gap-2">
        <Label htmlFor="location">Lieu</Label>
        <Textarea
          {...register("location", { required: true })}
          defaultValue={club.address || undefined}
          placeholder="24, Rue Alexandre Guilmant, 92190 Meudon"
          className="text-base"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button type="button" asChild variant="secondary">
          <Link to={`~/club/${club.id}`}>Annuler</Link>
        </Button>
        <Button type="submit" disabled={isCreationPending}>
          Créer
        </Button>
      </div>
    </form>
  );
}
