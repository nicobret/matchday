import { buttonVariants } from "@/components/ui/button";
import useAuth from "@/lib/auth/useAuth";
import useClubs from "@/lib/club/useClubs";
import { Search } from "lucide-react";
import { Link } from "wouter";
import ClubCarousel from "../../../components/ClubCarousel";
import CreateClubDialog from "./CreateClubDialog";

export default function MyClubs() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const { data: clubs, isError, isPending } = useClubs(userId);
  const myClubs = clubs ?? [];

  return (
    <section id="my-clubs">
      <h2 className="font-new-amsterdam scroll-m-20 text-center text-4xl md:text-justify">
        Mes clubs
      </h2>

      {isPending ? (
        <p className="animate-pulse text-center">Chargement des clubs...</p>
      ) : isError ? (
        <p className="text-center">Une erreur est survenue.</p>
      ) : myClubs.length === 0 ? (
        <p className="text-center">
          Vous n'êtes membre d'aucun club.{" "}
          <Link to="~/club/search">
            <Search className="h-4 w-4" />
            Chercher un club
          </Link>
        </p>
      ) : (
        <ClubCarousel clubs={myClubs} />
      )}

      <div className="mx-auto mt-4 grid w-2/3 gap-2 md:w-full md:grid-cols-3 md:gap-4">
        <Link
          to="~/club/search"
          className={buttonVariants({ variant: "outline" })}
        >
          <Search className="h-4 w-4" />
          Chercher un club
        </Link>
        <CreateClubDialog buttonClassName="w-full" />
      </div>
    </section>
  );
}
