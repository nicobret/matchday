import { Button, buttonVariants } from "@/components/ui/button";
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
import { Save } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Club } from "../lib/club/club.service";
import useUpdateClub from "../lib/club/useUpdateClub";

export default function ClubForm({ initialData }: { initialData: Club }) {
  const [_location, navigate] = useLocation();
  const [formData, setFormData] = useState({
    id: initialData.id || 0,
    name: initialData.name || "",
    description: initialData.description || "",
    address: initialData.address || "",
    postcode: initialData.postcode || "",
    city: initialData.city || "",
    country: initialData.country || "France",
  });
  const { mutate, isPending } = useUpdateClub(initialData.id);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate(formData, { onSuccess: () => navigate("~/") });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-6 md:grid-cols-2">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="clubname">Nom du club</Label>
          <Input
            type="text"
            id="clubname"
            placeholder="Le club des champions"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
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
      </div>

      <div>
        <div className="grid gap-6">
          <div className="grid gap-2">
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

          <div className="grid gap-2">
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

          <div className="grid w-full gap-4 md:grid-cols-2">
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
        </div>
      </div>

      <Button type="submit" disabled={isPending || !formData.name}>
        <Save className="mr-2 h-5 w-5" />
        Enregistrer
      </Button>
      <Link to={"/"} className={buttonVariants({ variant: "secondary" })}>
        Annuler
      </Link>
    </form>
  );
}
