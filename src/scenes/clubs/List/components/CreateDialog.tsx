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
import useStore from "@/utils/zustand";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateDialog() {
  const { user } = useStore();
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

  async function handleSubmit() {
    try {
      setLoading(true);
      if (!user) {
        throw new Error("Vous n'êtes pas connecté");
      }

      const { data, error } = await supabaseClient
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

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        window.alert("Club créé avec succès !");
        navigate(`/club/${data[0].id}`);
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
          <Button className="mt-4">
            <Plus className="w-5 h-5 mr-2" />
            <p>Créer</p>
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un club</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

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

          <Label htmlFor="clubdescription">Logo</Label>
          <Input type="file" id="clublogo" />

          <Label htmlFor="country">Pays</Label>
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, country: value })
            }
            value={formData.country}
            defaultValue="France"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a verified email to display" />
            </SelectTrigger>
            <SelectContent>
              {countryList.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label htmlFor="address">Numéro et rue</Label>
          <Input
            type="text"
            id="address"
            placeholder="Rue du club 1, 1000 Bruxelles"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />

          <div className="grid md:grid-cols-2 w-full gap-4 mt-4">
            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="postcode">Code Postal</Label>
              <Input
                type="text"
                id="postcode"
                placeholder="10 000"
                value={formData.postcode}
                onChange={(e) =>
                  setFormData({ ...formData, postcode: e.target.value })
                }
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                type="text"
                id="city"
                placeholder="Bruxelles"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => handleSubmit()}
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
