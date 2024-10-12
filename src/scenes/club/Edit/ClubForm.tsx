import { SessionContext } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Save, Trash } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Club, deleteClub, updateClub } from "../lib/club.service";

export default function ClubForm({ initialData }: { initialData: Club }) {
  const { session } = useContext(SessionContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: initialData.id || 0,
    name: initialData.name || "",
    description: initialData.description || "",
    address: initialData.address || "",
    postcode: initialData.postcode || "",
    city: initialData.city || "",
    country: initialData.country || "France",
  });

  async function handleDelete(club: Club) {
    try {
      if (!session?.user) {
        throw new Error("Vous devez être connecté pour supprimer un club.");
      }
      if (session.user?.id !== club.creator_id) {
        throw new Error("Vous n'êtes pas autorisé à supprimer ce club.");
      }
      if (window.confirm("Voulez-vous vraiment supprimer ce club ?")) {
        await deleteClub(club);
        window.alert("Club supprimé avec succès !");
        navigate("/");
      }
    } catch (error) {
      window.alert(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!session?.user) {
        throw new Error("Vous devez être connecté pour modifier un club.");
      }
      await updateClub(formData, initialData.id);
      window.alert("Club modifié avec succès !");
      navigate(`/club/${initialData.id}`);
    } catch (error) {
      window.alert(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Informations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-2">
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
          </div>

          <div className="mt-4 grid w-full items-center gap-2">
            <Label htmlFor="clubdescription">Description</Label>
            <Textarea
              id="clubdescription"
              placeholder="Le meilleur club de tous les temps."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={5}
            />
          </div>

          {/* <div className="mt-4 grid w-full items-center gap-2">
          <Label htmlFor="clublogo">Logo</Label>
          <Input type="file" id="clublogo" />
        </div> */}
        </CardContent>
      </Card>

      <Card className="">
        <CardHeader>
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Adresse
          </h2>
        </CardHeader>

        <CardContent className="">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="country">Pays</Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, country: value })
              }
              value={formData.country}
              defaultValue="France"
            >
              <SelectTrigger>
                <SelectValue placeholder="Belgique" />
              </SelectTrigger>
              <SelectContent>
                {countryList.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 grid w-full items-center gap-2">
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
          </div>

          <div className="mt-4 grid w-full gap-4 md:grid-cols-2">
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
        </CardContent>
      </Card>

      <div className="grid w-full gap-4 md:grid-cols-2">
        <Button type="submit" disabled={!formData.name}>
          <Save className="mr-2 h-5 w-5" />
          Enregistrer
        </Button>
        {initialData.id && (
          <Button
            type="button"
            variant="secondary"
            disabled={loading || initialData.creator_id !== session?.user?.id}
            onClick={() => handleDelete(initialData)}
          >
            <Trash className="mr-2 h-5 w-5" />
            Supprimer le club
          </Button>
        )}
      </div>
    </form>
  );
}
