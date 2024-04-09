import supabaseClient from "@/utils/supabase";
import useStore from "@/utils/zustand";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { UserCircle } from "lucide-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Button } from "./ui/button";
import { ModeToggle } from "./mode-toggle";

export function UserMenu() {
  const { session, setSession } = useStore();

  async function logout() {
    await supabaseClient.auth.signOut();
    setSession(null);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <UserCircle className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        {session ? (
          <SheetHeader>
            <SheetTitle>Mon compte</SheetTitle>
            <SheetDescription>
              <p>Bonjour, {session.user.email}.</p>
              <p>Vous êtes connecté.</p>
            </SheetDescription>
            <Button onClick={logout} variant="outline">
              Se déconnecter
            </Button>
          </SheetHeader>
        ) : (
          <SheetHeader>
            <SheetTitle>Connexion</SheetTitle>
            <SheetDescription>
              <p>Connectez-vous pour accéder à votre compte.</p>
            </SheetDescription>
            <Auth
              supabaseClient={supabaseClient}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
            />
          </SheetHeader>
        )}
        <br />
        <ModeToggle />
      </SheetContent>
    </Sheet>
  );
}
