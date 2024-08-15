import { SessionContext } from "@/components/auth-provider";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Club, deleteClub, fetchClub, updateClub } from "./club.service";

export default function EditClub() {
  const { id } = useParams();
  const { session } = useContext(SessionContext);
  const navigate = useNavigate();
  const [club, setClub] = useState<Club>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    address: "",
    postcode: "",
    city: "",
    country: "",
  });

  async function getClub(id: string) {
    setLoading(true);
    try {
      const data = await fetchClub(parseInt(id));
      setClub(data);
      setFormData({
        id,
        name: data.name || "",
        description: data.description || "",
        address: data.address || "",
        postcode: data.postcode || "",
        city: data.city || "",
        country: data.country || "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

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

  useEffect(() => {
    if (id) getClub(id).catch(console.error);
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!session?.user) {
        throw new Error("Vous devez être connecté pour modifier un club.");
      }
      if (!id) {
        throw new Error("Club non trouvé.");
      }
      const data = await updateClub(formData, id);
      setClub(data);
      window.alert("Club modifié avec succès !");
      navigate(`/club/${id}`);
    } catch (error) {
      window.alert(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p className="animate_pulse text-center">Chargement...</p>;
  }
  if (!club) {
    return <p className="text-center">Club non trouvé</p>;
  }
  return (
    <div className="p-4">
      <Breadcrumbs
        links={[
          { label: club.name || "", link: `/club/${id}` },
          { label: "Modifier", link: "#" },
        ]}
      />

      <h2 className="mb-2 mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Modifier mon club
      </h2>

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
          {id && (
            <Button
              type="button"
              variant="secondary"
              disabled={loading || club.creator_id !== session?.user?.id}
              onClick={() => handleDelete(club)}
            >
              <Trash className="mr-2 h-5 w-5" />
              Supprimer le club
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
