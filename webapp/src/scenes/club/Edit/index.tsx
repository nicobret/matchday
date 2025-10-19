import useClub from "@/lib/club/useClub";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import ClubForm from "./components/ClubForm";
import CreateSeasonDialog from "./components/CreateSeasonDialog";
import DeleteClub from "./components/DeleteClub";
import SeasonList from "./components/SeasonList";

export default function EditClub() {
  const { id } = useParams();
  const { data: club, isError, isPending } = useClub(Number(id));

  if (isError) {
    return <p>Erreur lors du chargement du club</p>;
  }
  if (isPending) {
    return <p className="animate_pulse text-center">Chargement...</p>;
  }
  return (
    <div className="mx-auto max-w-5xl p-4">
      <Link to={"/"} className="text-muted-foreground text-sm">
        <ArrowLeft className="mr-2 inline-block h-4 w-4 align-text-top" />
        Retour au club
      </Link>

      <section id="club" className="mt-6">
        <h2 className="text-2xl font-semibold uppercase tracking-tight">
          Modifier mon club
        </h2>
        <ClubForm initialData={club} />
      </section>

      <section id="seasons" className="mt-16">
        <h2 className="mb-4 text-2xl font-semibold uppercase tracking-tight">
          Liste des saisons
        </h2>
        <CreateSeasonDialog />
        <br />
        <br />
        <SeasonList />
      </section>

      <section id="delete" className="mt-16">
        <h2 className="mb-4 text-2xl font-semibold uppercase tracking-tight">
          Supprimer le club
        </h2>
        <DeleteClub club={club} />
      </section>
    </div>
  );
}
