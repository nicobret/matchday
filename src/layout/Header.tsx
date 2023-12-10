import { Link, NavLink } from "react-router-dom";
import useStore from "../utils/zustand";
import supabaseClient from "../utils/supabase";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Trophy } from "lucide-react";

export default function Header() {
  const { session, setSession } = useStore();
  console.log("🚀 ~ file: Header.tsx:15 ~ Header ~ session:", session);

  async function logout() {
    await supabaseClient.auth.signOut();
    setSession(null);
  }

  return (
    <header className="flex items-center p-2 gap-4">
      <NavLink to="/">
        <div className="flex items-center gap-2">
          <Trophy />
          <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight">
            Matchday
          </h1>
        </div>
      </NavLink>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to="clubs">Clubs</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to="/games">Matches</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to="/players">Joueurs</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {session ? (
        <div className="flex items-center gap-8 ml-auto text-right">
          <p>{session.user.email}</p>
          <Button variant="outline" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Déconnexion
          </Button>
        </div>
      ) : (
        <Link to="auth">
          <p className="ml-auto">Se connecter</p>
        </Link>
      )}
    </header>
  );
}
