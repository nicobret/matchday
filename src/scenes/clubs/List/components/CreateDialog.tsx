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
import supabaseClient from "@/utils/supabase";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateDialog() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    postcode: "",
    city: "",
    country: "France",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setLoading(true);
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      if (!user) {
        throw new Error("Vous n'êtes pas connecté");
      }

      const { data: club, error: club_error } = await supabaseClient
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

      const { data: club_members, error: club_members_error } =
        await supabaseClient
          .from("club_enrolments")
          .insert({ club_id: club[0].id, user_id: user.id, role: "admin" })
          .select("user_id");

      if (club_members_error) {
        throw new Error(club_members_error.message);
      }

      if (club_members) {
        window.alert("Club créé avec succès !");
        navigate(`/club/${club[0].id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" className="mt-6">
            <Plus className="w-5 h-5 mr-2" />
            <p>Créer</p>
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
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
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
    </>
  );
}
