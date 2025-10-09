import useAuth from "@/lib/auth/useAuth";
import { Club } from "@/lib/club/club.service";

export default function ClubHeader({
  club,
  isMember,
  isAdmin,
}: {
  club: Club;
  isMember: boolean;
  isAdmin: boolean;
}) {
  const { session } = useAuth();

  const userStatus = isAdmin
    ? "Vous êtes administrateur"
    : isMember
      ? "Vous êtes membre."
      : session
        ? "Vous n'êtes pas membre."
        : "Vous n'êtes pas connecté(e)";

  return (
    <header className="flex gap-4">
      <div className="h-24 w-24 flex-none rounded-xl border-2 border-dashed"></div>
      <div>
        <h1 className="font-new-amsterdam line-clamp-1 scroll-m-20 text-4xl">
          {club.name}
        </h1>
        <p
          className={`text-muted-foreground text-sm leading-relaxed ${isMember ? "text-primary" : ""}`}
        >
          {userStatus}
        </p>
      </div>
    </header>
  );
}
