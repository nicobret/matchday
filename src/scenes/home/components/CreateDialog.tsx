import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import useAuth from "@/lib/useAuth";
import { countryList } from "@/lib/utils";
import { useCreateClub } from "@/scenes/club/lib/club/useCreateClub";
import useCreateMember from "@/scenes/club/lib/member/useCreateMember";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { TablesInsert } from "types/supabase";
import { useLocation } from "wouter";

type FormValues = Omit<TablesInsert<"clubs">, "creator_id">;

export default function CreateDialog() {
  const [, navigate] = useLocation();
  const { session } = useAuth();
  const { register, handleSubmit } = useForm<FormValues>();
  const { mutate: createClub, isPending } = useCreateClub();
  const { mutate: createMember } = useCreateMember();

  function onSubmit(data: FormValues) {
    if (!session) return;
    const payload = { ...data, creator_id: session.user.id };
    createClub(payload, {
      onSuccess(club) {
        createMember({
          club_id: club.id,
          user_id: session.user.id,
          role: "admin",
        });
        navigate(`~/club/${club.id}`);
      },
    });
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
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} id="create-club-form">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom du club</Label>
            <Input
              type="text"
              placeholder="Le club des champions"
              required
              {...register("name")}
            />
          </div>
          <br />
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              placeholder="Le meilleur club de tous les temps."
              rows={5}
              {...register("description")}
            />
          </div>
          <br />
          <div className="grid gap-2">
            <Label htmlFor="country">Pays</Label>
            <Select {...register("country")} defaultValue="France">
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
          </div>
        </form>

        <DialogFooter>
          <Button
            type="submit"
            form="create-club-form"
            disabled={isPending}
            className="w-full"
          >
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
