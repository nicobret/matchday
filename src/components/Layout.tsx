import supabase from "@/utils/supabase";
import { Trophy, UserCircle } from "lucide-react";
import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { SessionContext } from "./auth-provider";
import { ModeToggle } from "./mode-toggle";
import { Button, buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { session, setSession } = useContext(SessionContext);

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
  }
  return (
    <div className="relative">
      <header className="fixed top-0 z-10 mx-auto flex w-full items-center gap-2 border-b-[1px] border-b-border p-2 backdrop-blur">
        <div className="flex items-center gap-2">
          <NavLink to="/">
            <div className="flex items-center gap-4 p-2">
              <Trophy className="text-primary" />
              <p className="block text-2xl font-extrabold tracking-tight text-primary">
                Matchday_
              </p>
            </div>
          </NavLink>
        </div>
        <div className="ml-auto">
          <ModeToggle />
        </div>
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <UserCircle className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="p-4">
                <Link to="/account">Mon compte</Link>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={logout} className="p-4">
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/auth" className={buttonVariants()}>
            Connexion
          </Link>
        )}
      </header>

      <main className="mx-auto mb-20 mt-20 min-h-screen max-w-7xl">
        {children}
      </main>

      <footer className="flex justify-center bg-muted p-6 text-muted-foreground">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} -{" "}
          <a
            href="https://github.com/nicobret"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
          >
            nicobret
          </a>
        </p>
      </footer>
    </div>
  );
}
