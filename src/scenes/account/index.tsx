import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Tables } from "types/supabase";
import { fetchProfile, updateProfile } from "./account.service";

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Tables<"users">>();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstname = formData.get("firstName") as string;
    const lastname = formData.get("lastName") as string;
    if (!firstname || !lastname) {
      window.alert("Veuillez remplir tous les champs");
      return;
    }
    try {
      const data = await updateProfile(firstname, lastname);
      setProfile(data);
      window.alert("Profil mis à jour");
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
      <Breadcrumbs links={[{ label: "Mon compte", link: "/account" }]} />

      <h2 className="mt-6 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight">
        Mon compte
      </h2>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="profile-form">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              type="text"
              name="firstName"
              className="input"
              placeholder="Prénom"
              defaultValue={profile.firstname || ""}
            />

            <Label htmlFor="lastName">Nom</Label>
            <Input
              type="text"
              name="lastName"
              className="input"
              placeholder="Nom"
              defaultValue={profile.lastname || ""}
            />
          </form>
        </CardContent>

        <CardFooter>
          <Button form="profile-form" type="submit" disabled={loading}>
            Enregistrer
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
