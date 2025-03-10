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
import { useToast } from "@/hooks/use-toast";
import { countryList } from "@/lib/utils";
import supabase from "@/utils/supabase";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function CreateDialog() {
  const [_location, navigate] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    postcode: "",
    city: "",
    country: "France",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

      const { data: club, error: club_error } = await supabase
        .from("clubs")
        .insert({
          creator_id: user.id,
          name: formData.name,
          description: formData.description,
          address: formData.address,
          postcode: formData.postcode,
          city: formData.city,
          country: formData.country,
        })
        .select();

      if (club_error) {
        throw new Error(club_error.message);
      }

      const { data: club_members, error: club_members_error } = await supabase
        .from("club_member")
        .insert({ club_id: club[0].id, user_id: user.id, role: "admin" })
        .select("user_id");

      if (club_members_error) {
        throw new Error(club_members_error.message);
      }

      if (club_members) {
        toast({ description: "Club créé avec succès !" });
        navigate(`~/club/${club[0].id}`);
      }
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
          Créer un club
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
