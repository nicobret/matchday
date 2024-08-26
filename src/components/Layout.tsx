import supabase from "@/utils/supabase";
import { UserCircle } from "lucide-react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { SessionContext } from "./auth-provider";
import { ModeToggle } from "./mode-toggle";
import { Button, buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Logo from "./Logo";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { session, setSession } = useContext(SessionContext);

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
  }
  return (
    <div className="relative">
      <nav className="fixed top-0 z-10 mx-auto flex w-full items-center gap-2 px-1 backdrop-blur">
        <Link to="/">
          <Logo />
        </Link>

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
          <Link
            to={`/auth?redirectTo=${window.location.pathname}`}
            className={buttonVariants()}
          >
            Connexion
          </Link>
        )}
      </nav>

      <div className="mx-auto mb-20 mt-12 min-h-screen max-w-5xl">
        {children}
      </div>

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
