import useAuth from "@/lib/auth/useAuth";
import useClubs from "@/lib/club/useClubs";
import ClubCarousel from "../../components/ClubCarousel";
import CreateClubDialog from "./CreateClubDialog";

export default function MyClubs() {
  const { session } = useAuth();
  const { data: clubs, isError, isPending } = useClubs();
  const myClubs =
    clubs?.filter((c) =>
      c.members?.some((m) => m.user_id === session?.user?.id),
    ) ?? [];

  return (
    <section id="my-clubs">
      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Mes clubs
      </h2>

      {isPending ? (
        <p className="animate-pulse text-center">Chargement des clubs...</p>
      ) : isError ? (
        <p className="text-center">Une erreur est survenue.</p>
      ) : myClubs.length === 0 ? (
        <p className="text-center">
          Vous n'êtes membre d'aucun club.{" "}
          <span className="text-primary underline underline-offset-2">
            <a href="#search">Trouvez un club</a>
          </span>
        </p>
      ) : myClubs.length ? (
        <ClubCarousel clubs={myClubs} />
      ) : (
        <p className="text-center">Vous n'êtes membre d'aucun club</p>
      )}

      <div className="mt-4">
        <CreateClubDialog />
      </div>
    </section>
  );
}
