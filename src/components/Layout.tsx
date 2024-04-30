import { NavLink } from "react-router-dom";
import { Trophy } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";

export default function Layout({ children }) {
  return (
    <>
      <header className="max-w-screen-xl mx-auto flex items-center justify-between p-2">
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
        <UserMenu />
      </header>

      <main className="max-w-screen-xl mx-auto mb-20 min-h-screen">
        {children}
      </main>

      <footer className="flex justify-center p-6 bg-muted text-muted-foreground">
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
    </>
  );
}
