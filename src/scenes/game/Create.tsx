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
import { useToast } from "@/hooks/use-toast";
import { fromZonedTime } from "date-fns-tz";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Club } from "../club/lib/club.service";
import useClub from "../club/lib/useClub";
import { categories } from "./lib/game/game.service";
import useCreateGame from "./lib/game/useCreateGame";

export default function CreateGame() {
  const clubId = new URLSearchParams(window.location.search).get("clubId");
  const {
    data: club,
    isIdle,
    isLoading,
    isError,
    isMember,
  } = useClub(Number(clubId));

  if (isIdle) {
    return <p className="text-center">Sélectionnez un club</p>;
  }
  if (isLoading) {
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
  return <GameForm club={club} />;
}

function GameForm({ club }: { club: Club }) {
  const [_location, navigate] = useLocation();
  const [category, setCategory] = useState("football");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [durationInMinutes, setDurationInMinutes] = useState(60);
  const [playerCount, setPlayerCount] = useState(10);
  const [location, setLocation] = useState(
    `${club?.address}, ${club?.postcode} ${club?.city}`,
  );
  const { mutate, isLoading } = useCreateGame(club.id);

  const seasons = club.seasons || [];
  const seasonOptions = [
    ...seasons
      .sort((a, b) => b.name.localeCompare(a.name))
      .map((season) => ({ label: season.name, value: season.id })),
    { label: "Hors saison", value: "none" },
  ];
  const [season, setSeason] = useState(seasonOptions[0].value);

  const { toast } = useToast();

  function validateForm() {
    return (
      date && time && playerCount && location && durationInMinutes && category
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validateForm()) {
      window.alert("Veuillez remplir tous les champs");
      return;
    }

    const zonedDateTime = fromZonedTime(`${date}T${time}`, "Europe/Paris");

    const newgame = {
      date: zonedDateTime.toISOString(),
      season_id: season,
      total_players: playerCount,
      location,
      status: "published",
      duration: durationInMinutes * 60,
      category,
    };

    mutate(newgame, {
      onSuccess: (data) => {
        toast({ description: "Match créé avec succès" });
        navigate(`~/game/${data?.id}`);
      },
    });
  }

  return (
    <div className="p-4">
      <Link to={`~/club/${club.id}`} className="text-sm text-muted-foreground">
        <ArrowLeft className="mr-2 inline-block h-4 w-4 align-text-top" />
        Retour au match
      </Link>

      <h2 className="mb-2 mt-6 scroll-m-20 text-center text-2xl font-semibold uppercase tracking-tight">
        Créer un match
      </h2>

      <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
        <div className="mb-1 grid w-full items-center gap-2">
          <Label htmlFor="season">Saison</Label>
          <Select
            name="season"
            value={season}
            onValueChange={(value) => setSeason(value)}
          >
            <SelectTrigger>
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
        </div>
        <Link
          to={`~/club/${club.id}/edit#seasons`}
          className="text-sm text-primary"
        >
          Ajouter une saison
        </Link>

        <div className="mt-10 grid w-full grid-cols-2 gap-3">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="category">Sport</Label>
            <Select
              name="category"
              value={category}
              onValueChange={setCategory}
              disabled={true}
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

          <div className="grid w-full items-center gap-2">
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

        <div className="my-6 grid w-full grid-cols-2 gap-3">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="date">Date du match</Label>
            <Input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="time">Heure du match</Label>
            <Input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="duration">Durée en minutes</Label>
          <Input
            type="number"
            id="duration"
            value={durationInMinutes}
            onChange={(e) => setDurationInMinutes(parseInt(e.target.value))}
          />
        </div>

        <div className="my-6 grid w-full items-center gap-2">
          <Label htmlFor="location">Lieu</Label>
          <Textarea
            id="location"
            placeholder="24, Rue Alexandre Guilmant, 92190 Meudon"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-base"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button type="button" asChild variant="secondary">
            <Link to={`~/club/${club.id}`}>Annuler</Link>
          </Button>
          <Button type="submit" disabled={isLoading}>
            Créer
          </Button>
        </div>
      </form>
    </div>
  );
}
