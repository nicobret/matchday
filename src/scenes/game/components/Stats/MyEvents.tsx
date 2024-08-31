import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { countryList } from "@/lib/utils";
import supabase from "@/utils/supabase";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Game } from "../../games.service";

const eventTypes = [
  { label: "But de gueudin", value: "goal" },
  { label: "Passe dé de l'espace", value: "assist" },
  { label: "Arrêt de star", value: "save" },
];

export default function MyEvents({ game }: { game: Game }) {
  const [formData, setFormData] = useState({
    type: "",
    value: undefined,
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Vous n'êtes pas connecté");
      }

      const { data } = await supabase
        .from("game_event")
        .insert({
          game_id: game?.id,
          user_id: user.id,
          type: formData.type,
          value: formData.value,
        })
        .select()
        .single()
        .throwOnError();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Plus className="mr-2 h-5 w-5" />
          Ajouter un événement
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un club</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} id="create-club-form">
          <Label htmlFor="clubname">Nom du club</Label>
          <Input
            type="text"
            id="clubname"
            placeholder="Le club des champions"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <Label htmlFor="clubdescription">Description</Label>
          <Textarea
            id="clubdescription"
            placeholder="Le meilleur club de tous les temps."
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
            rows={5}
          />

          {/* <Label htmlFor="clubdescription">Logo</Label>
            <Input type="file" id="clublogo" /> */}

          <Label htmlFor="country">Pays</Label>
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, country: value })
            }
            value={formData.country}
            defaultValue="France"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countryList.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="create-club-form"
            disabled={loading || !formData.name}
            className="w-full"
          >
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
