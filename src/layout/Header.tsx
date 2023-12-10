import { useState } from "react";
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
import { LogOut, Trophy, UserCircle } from "lucide-react";

export default function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="relative flex items-center justify-between p-2 gap-4">
      <div className="flex items-center gap-2">
        <NavLink to="/">
          <div className="flex items-center gap-4 p-2">
            <Trophy />
            <h1 className="hidden md:block text-2xl font-extrabold tracking-tight">
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
      </div>

      <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="p-2">
        <UserCircle className="" />
      </button>

      {userMenuOpen && (
        <div className="absolute right-2 top-12 p-4 bg-white border rounded shadow-lg">
          <UserMenu />
        </div>
      )}
    </header>
  );
}

function UserMenu() {
  const { session, setSession } = useStore();

  async function logout() {
    await supabaseClient.auth.signOut();
    setSession(null);
  }

  if (session)
    return (
      <div className="text-right space-y-4">
        <p>{session.user.email}</p>
        <Button variant="outline" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    );

  return (
    <Link to="auth">
      <p className="">Se connecter</p>
    </Link>
  );
}
