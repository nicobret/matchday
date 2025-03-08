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
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Tables } from "types/supabase";
import { Link, useLocation } from "wouter";
import { fetchProfile, updateProfile } from "./account.service";

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Tables<"users">>();
  const [_location, navigate] = useLocation();
  const { toast } = useToast();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstname = formData.get("firstName") as string;
    const lastname = formData.get("lastName") as string;
    if (!firstname) {
      window.alert("Veuillez remplir tous les champs");
      return;
    }
    try {
      const data = await updateProfile(firstname, lastname);
      setProfile(data);
      toast({ description: "Profil mis à jour" });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchProfile()
      .then((data) => setProfile(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse">Chargement...</div>;
  }
  if (!profile) {
    return <div>Profil non trouvé</div>;
  }
  return (
    <div className="p-4">
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
            onSubmit={handleSubmit}
            id="profile-form"
            className="grid grid-cols-1 gap-4"
          >
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                type="text"
                name="firstName"
                className="input"
                placeholder="Prénom"
                defaultValue={profile.firstname || ""}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nom (facultatif)</Label>
              <Input
                type="text"
                name="lastName"
                className="input"
                placeholder="Nom"
                defaultValue={profile.lastname || ""}
              />
            </div>
          </form>
        </CardContent>

        <CardFooter>
          <div className="flex gap-2">
            <Button form="profile-form" type="submit" disabled={loading}>
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
