import supabaseClient from "@/utils/supabase";
import useStore from "@/utils/zustand";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function UserMenu() {
  const { session, setSession } = useStore();

  async function logout() {
    await supabaseClient.auth.signOut();
    setSession(null);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <UserCircle className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {session ? (
          <>
            <DropdownMenuItem>
              <Link to="/account">Mon compte</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Déconnexion</DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem>
            <Link to="/auth">Se connecter</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
