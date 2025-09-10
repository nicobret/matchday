import useAuth from "@/lib/auth/useAuth";
import { UserCircle } from "lucide-react";
import { Link } from "wouter";
import Logo from "./Logo";
import { ModeToggle } from "./mode-toggle";
import Notifications from "./Notifications";
import { Button, buttonVariants } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Toaster } from "./ui/toaster";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { session, logout } = useAuth();

  return (
    <div className="relative">
      <div className="fixed top-0 z-10 w-full backdrop-blur-sm">
        <nav className="mx-auto flex items-center gap-2 pl-1 pr-2">
          <Link to="/">
            <Logo />
          </Link>

          <div className="ml-auto">
            <ModeToggle />
          </div>

          <Notifications />

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
              to={`/auth/login?redirectTo=${window.location.pathname}`}
              className={buttonVariants()}
            >
              Connexion
            </Link>
          )}
        </nav>
      </div>

      <div className="mx-auto mb-20 mt-12">{children}</div>
      <Toaster />

      {/* <footer className="flex justify-center bg-muted p-6 text-muted-foreground">
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
      </footer> */}
    </div>
  );
}
