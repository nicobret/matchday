import { SessionContext } from "@/App";
import Breadcrumbs from "@/components/Breadcrumbs";
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
import supabaseClient from "@/utils/supabase";
import { useContext, useEffect, useState } from "react";

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  async function getProfile() {
    try {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      const { data } = await supabaseClient
        .from("users")
        .select()
        .eq("id", user.id)
        .single()
        .throwOnError();
      if (!data) {
        throw new Error("Profile not found");
      }
      setProfile(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const firstname = formData.get("firstName") as string;
    const lastname = formData.get("lastName") as string;
    try {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      const { data: updatedProfile } = await supabaseClient
        .from("users")
        .update({ firstname, lastname })
        .eq("id", user.id)
        .select("*")
        .throwOnError();
      setProfile(updatedProfile);
      window.alert("Profil mis à jour");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getProfile();
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

      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-6">
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
              defaultValue={profile.firstname}
            />

            <Label htmlFor="lastName">Nom</Label>
            <Input
              type="text"
              name="lastName"
              className="input"
              placeholder="Nom"
              defaultValue={profile.lastname}
            />
          </form>
        </CardContent>

        <CardFooter>
          <Button form="profile-form" type="submit">
            Enregistrer
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
