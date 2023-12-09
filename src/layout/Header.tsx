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

export default function Header() {
  const { session, setSession } = useStore();
  console.log("🚀 ~ file: Header.tsx:15 ~ Header ~ session:", session);

  async function logout() {
    await supabaseClient.auth.signOut();
    setSession(null);
  }

  return (
    <header className="flex items-center p-2 gap-4 border-b-2 border-slate-100">
      <NavLink to="/">
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight">
          Matchday
        </h1>
      </NavLink>

      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="clubs">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Clubs
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/games">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Matches
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/players">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Joueurs
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {session ? (
        <div className="flex items-center gap-8 ml-auto text-right">
          <p>{session.user.email}</p>
          <Button variant="outline" onClick={logout}>
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
