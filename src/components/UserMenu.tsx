import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import supabase from "@/utils/supabase";

import { SessionContext } from "@/components/auth-provider";
import { Auth } from "@supabase/auth-ui-react";
import { UserCircle } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

export function UserMenu() {
  const { session, setSession } = useContext(SessionContext);

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {session ? (
          <Button variant="outline" size="icon">
            <UserCircle className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        ) : (
          <Button>Connexion</Button>
        )}
      </SheetTrigger>
      <SheetContent>
        {session ? (
          <SheetHeader>
            <SheetTitle>Mon compte</SheetTitle>
            <SheetDescription>
              Bonjour, {session.user.email}. Vous êtes connecté.
            </SheetDescription>
            <Link to="/account">Mon compte</Link>
            <Button onClick={logout} variant="outline">
              Se déconnecter
            </Button>
          </SheetHeader>
        ) : (
          <SheetHeader>
            <SheetTitle>Connexion</SheetTitle>
            <SheetDescription>
              Connectez-vous ou inscrivez-vous pour accéder à votre compte.
            </SheetDescription>
            <div>
              <Auth supabaseClient={supabase} providers={[]} />
            </div>
          </SheetHeader>
        )}
        <br />
        <ModeToggle />
      </SheetContent>
    </Sheet>
  );
}
