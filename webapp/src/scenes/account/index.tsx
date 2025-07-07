import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/lib/useAuth";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { TablesUpdate } from "shared/types/supabase";
import { Link } from "wouter";
import useProfile from "../home/useProfile";
import useUpdateProfile from "./lib/useUpdateProfile";

type FormValues = TablesUpdate<"users">;

export default function Account() {
  const { session } = useAuth();
  const userId = session?.user.id || "";
  const { data: profile, isPending, error } = useProfile(userId);
  const { mutate } = useUpdateProfile(userId);
  const { register, handleSubmit } = useForm<FormValues>();

  function onSubmit(data: FormValues) {
    mutate(data);
  }

  if (!session) {
    return <div>Veuillez vous connecter pour accéder à votre compte</div>;
  }
  if (isPending) {
    return <div className="animate-pulse">Chargement...</div>;
  }
  if (error) {
    return <div>Profil non trouvé</div>;
  }
  return (
    <div className="mx-auto max-w-5xl p-4">
      <Link to={"/"} className="text-muted-foreground text-sm">
        <ArrowLeft className="mr-2 inline-block h-4 w-4 align-text-top" />
        Retour au club
      </Link>

      <h2 className="mt-6 scroll-m-20 text-3xl font-semibold tracking-tight">
        Mon compte
      </h2>

      {profile.firstname ? null : (
        <Alert className="mt-4">
          <AlertTitle>Dernière étape !</AlertTitle>
          <AlertDescription>Veuillez renseigner votre nom</AlertDescription>
        </Alert>
      )}

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            id="profile-form"
            className="grid grid-cols-1 gap-4"
          >
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                type="text"
                {...register("firstname")}
                required
                placeholder="Prénom"
                defaultValue={profile.firstname || ""}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nom (facultatif)</Label>
              <Input
                type="text"
                {...register("lastname")}
                placeholder="Nom"
                defaultValue={profile.lastname || ""}
              />
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <div className="flex gap-2">
            <Button form="profile-form" type="submit" disabled={isPending}>
              Enregistrer
            </Button>
            <Link href="/" className={buttonVariants({ variant: "secondary" })}>
              Retour à l'accueil
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
