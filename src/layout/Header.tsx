import { Link, NavLink } from "react-router-dom";
import useStore from "../utils/zustand";
import supabaseClient from "../utils/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
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
            <Link to="/leagues">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Ligues
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
        <div className="ml-auto text-right">
          <p>{session.user.email}</p>
          <Button variant="outline" onClick={logout}>
            Déconnexion
          </Button>
        </div>
      ) : (
        <Auth
          supabaseClient={supabaseClient}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      )}
    </header>
  );
}
