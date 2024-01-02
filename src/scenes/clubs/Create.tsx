import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useClubs } from "./useClubs";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
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
import { countryList } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreateClub = () => {
  const { createClub, updateClub } = useClubs();
  const { id } = useParams();
  const { fetchClub } = useClubs();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("France");

  async function get() {
    if (id) {
      const data = await fetchClub(id);
      setName(data?.name || "");
      setDescription(data?.description || "");
      setAddress(data?.address || "");
      setPostcode(data?.postcode || "");
      setCity(data?.city || "");
      setCountry(data?.country || "");
    }
  }

  useEffect(() => {
    get();
  }, [id]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (id) {
      await updateClub(id, name, description, address, postcode, city, country);
    } else {
      await createClub(name, description, address, postcode, city, country);
    }
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-1 text-sm text-gray-500">
        <Link to="/clubs">Clubs</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="#"> {id ? "Modifier mon club" : "Créer un club"}</Link>
      </div>

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-6 mb-2">
        {id ? "Modifier mon club" : "Créer un club"}
      </h2>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="clubname">Nom du club</Label>
                <Input
                  type="text"
                  id="clubname"
                  placeholder="Le club des champions"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="clubdescription">Description</Label>
                <Textarea
                  id="clubdescription"
                  placeholder="Le meilleur club de tous les temps."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="clubdescription">Logo</Label>
                <Input type="file" id="clublogo" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adresse</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="address">Numéro et rue</Label>
                <Input
                  type="text"
                  id="address"
                  placeholder="Rue du club 1, 1000 Bruxelles"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="postcode">Code Postal</Label>
                <Input
                  type="text"
                  id="postcode"
                  placeholder="10 000"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                />
              </div>

              <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  type="text"
                  id="city"
                  placeholder="Bruxelles"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="country">Pays</Label>
                <Select
                  onValueChange={(e) => setCountry(e)}
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
            </CardContent>
          </Card>
        </div>

        <Button
          type="submit"
          disabled={
            !name || !description || !address || !postcode || !city || !country
          }
          className="mt-4"
        >
          {id ? "Enregistrer" : "Créer"}
        </Button>
      </form>
    </div>
  );
};

export default CreateClub;
