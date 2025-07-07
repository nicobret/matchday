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
import { Club } from "@/lib/club/club.service";
import useUpdateClub from "@/lib/club/useUpdateClub";
import { countryList } from "@/lib/utils";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { TablesUpdate } from "shared/types/supabase";
import { Link, useLocation } from "wouter";

type FormValues = TablesUpdate<"clubs">;

export default function ClubForm({ initialData }: { initialData: Club }) {
  const [_location, navigate] = useLocation();
  const { register, handleSubmit } = useForm();
  const { mutate, isPending } = useUpdateClub(initialData.id);

  function onSubmit(data: FormValues) {
    mutate(data, { onSuccess: () => navigate("/") });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 grid gap-6 md:grid-cols-2"
    >
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="clubname">Nom du club</Label>
          <Input
            type="text"
            placeholder="Le club des champions"
            {...register("name")}
            defaultValue={initialData.name || undefined}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            placeholder="Le meilleur club de tous les temps."
            rows={5}
            {...register("description")}
            defaultValue={initialData.description || undefined}
          />
        </div>
      </div>

      <div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="country">Pays</Label>
            <Select
              {...register("country")}
              defaultValue={initialData.country || "France"}
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
              placeholder="Rue du club 1, 1000 Bruxelles"
              {...register("address")}
              defaultValue={initialData.address || undefined}
            />
          </div>

          <div className="grid w-full gap-4 md:grid-cols-2">
            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="postcode">Code Postal</Label>
              <Input
                type="text"
                placeholder="10 000"
                {...register("postcode")}
                defaultValue={initialData.postcode || undefined}
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                type="text"
                placeholder="Bruxelles"
                id="city"
                {...register("city")}
                defaultValue={initialData.city || undefined}
              />
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        <Save className="mr-2 h-5 w-5" />
        Enregistrer
      </Button>
      <Link to={"/"} className={buttonVariants({ variant: "secondary" })}>
        Annuler
      </Link>
    </form>
  );
}
