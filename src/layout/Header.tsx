import { NavLink } from "react-router-dom";
import { Trophy } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";

export default function Header() {
  return (
    <header className="relative flex items-center justify-between p-2">
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
  );
}
