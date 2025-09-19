import { Button } from "@/components/ui/button";
import useAuth from "@/lib/auth/useAuth";
import useClubs from "@/lib/club/useClubs";
import { Link } from "wouter";

export default function ClubSelector({
  setClubId,
}: {
  setClubId?: (id: number) => void;
}) {
  const { session } = useAuth();
  const { data: clubs } = useClubs();
  const myClubs =
    clubs?.filter((c) =>
      c.members?.some((m) => m.user_id === session?.user?.id),
    ) ?? [];

  return (
    <section id="club-selector">
      <p className="text-center">
        Veuillez sélectionner un club au préalable :
      </p>
      {myClubs.length === 0 ? (
        <p className="mt-4 text-center">
          Vous n&apos;êtes membre d'aucun club. Créez un club ou{" "}
          <Link to="~/">rejoignez-en un</Link>
          pour pouvoir créer des matchs.
        </p>
      ) : (
        <div className="mx-auto mt-6 grid max-w-lg gap-3 md:grid-cols-2">
          {myClubs.map((club) => (
            <Button
              key={club.id}
              variant="outline"
              className="w-full"
              onClick={() => setClubId?.(club.id)}
            >
              {club.name}
            </Button>
          ))}
        </div>
      )}
    </section>
  );
}
