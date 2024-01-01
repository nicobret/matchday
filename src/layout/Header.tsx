import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useStore from "../utils/zustand";
import supabaseClient from "../utils/supabase";
import { Button } from "@/components/ui/button";
import { LogOut, Trophy, UserCircle } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent } from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="relative flex items-center justify-between p-2">
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
              <NavigationMenuTrigger>Explorer</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="clubs">Clubs</Link>
                </NavigationMenuLink>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/games">Matches</Link>
                </NavigationMenuLink>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/players">Joueurs</Link>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link to="/my-club">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Mon club
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setUserMenuOpen(!userMenuOpen)}
        >
          <UserCircle className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">User menu</span>
        </Button>
      </div>

      {userMenuOpen && (
        <Card className="absolute right-2 top-14">
          <CardContent className="p-4">
            <UserMenu />
          </CardContent>
        </Card>
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
      <div className="text-right">
        <p>{session.user.email}</p>
        <Button variant="outline" onClick={logout} className="mt-2">
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
