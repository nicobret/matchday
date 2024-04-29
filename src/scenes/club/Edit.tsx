import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "@/utils/supabase";
import { Club } from "./club.service";
import { countryList } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Breadcrumbs from "@/components/Breadcrumbs";
import Container from "@/layout/Container";
import { Save, Trash } from "lucide-react";
import { SessionContext } from "@/components/auth-provider";

export default function EditClub() {
  const { id } = useParams();
  const { session } = useContext(SessionContext);
  const [club, setClub] = useState<Club>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    address: "",
    postcode: "",
    city: "",
    country: "France",
  });

  async function getClub(id: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clubs")
        .select("*, members: club_enrolments (*)")
        .eq("id", parseInt(id))
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setClub(data);
        setFormData({
          id,
          name: data.name,
          description: data.description,
          address: data.address,
          postcode: data.postcode,
          city: data.city,
          country: data.country,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateClub({
    id,
    name,
    description,
    address,
    postcode,
    city,
    country,
  }: {
    id: string;
    name: string;
    description: string;
    address: string;
    postcode: string;
    city: string;
    country: string;
  }) {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Vous devez être connecté pour modifier un club.");
      }

      const { error } = await supabase
        .from("clubs")
        .update({ name, description, address, postcode, city, country })
        .eq("id", parseInt(id));

      if (error) {
        throw new Error(error.message);
      }

      window.alert("Club modifié avec succès !");
    } catch (error) {
      window.alert(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteClub(club_id: number) {
    try {
      if (session.user?.id !== club.creator_id) {
        throw new Error("Vous n'êtes pas autorisé à supprimer ce club.");
      }
      if (window.confirm("Voulez-vous vraiment supprimer ce club ?")) {
        await supabase
          .from("clubs")
          .update({ deleted_at: new Date().toISOString() })
          .eq("id", club_id)
          .throwOnError();
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
    if (id) getClub(id);
  }, [id]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (id) await updateClub(formData);
  }

  if (loading) {
    return <p className="text-center animate_pulse">Chargement...</p>;
  }

  if (!club) {
    return <p className="text-center">Club non trouvé</p>;
  }

  return (
    <Container>
      <Breadcrumbs
        links={[
          { label: club?.name, link: `/club/${id}` },
          { label: "Modifier", link: "#" },
        ]}
      />

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-6 mb-2">
        Modifier mon club
      </h2>

      <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4 mt-4">
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

            <div className="grid w-full items-center gap-2 mt-4">
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

            <div className="grid w-full items-center gap-2 mt-4">
              <Label htmlFor="clubdescription">Logo</Label>
              <Input type="file" id="clublogo" />
            </div>
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
            </div>

            <div className="grid w-full items-center gap-2 mt-4">
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
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 w-full gap-4">
          <Button type="submit" disabled={!formData.name}>
            <Save className="w-5 h-5 mr-2" />
            Enregistrer
          </Button>
          {id && (
            <Button
              type="button"
              variant="secondary"
              disabled={loading || club.creator_id !== session?.user?.id}
              onClick={() => deleteClub(club.id)}
            >
              <Trash className="w-5 h-5 mr-2" />
              Supprimer le club
            </Button>
          )}
        </div>
      </form>
    </Container>
  );
}
