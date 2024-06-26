import { NavLink } from "react-router-dom";
import { Trophy } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="mx-auto flex max-w-screen-xl items-center justify-between p-2">
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

      <main className="mx-auto mb-20 min-h-screen max-w-screen-xl">
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
    </>
  );
}
