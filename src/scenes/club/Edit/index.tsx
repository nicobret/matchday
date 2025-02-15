import { Button } from "@/components/ui/button";
import useSeasons from "@/scenes/club/lib/season/useSeasons";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import useClub from "../lib/club/useClub";
import useCreateSeason from "../lib/season/useCreateSeason";
import ClubForm from "./ClubForm";
import DeleteClub from "./DeleteClub";
import SeasonList from "./SeasonList";

export default function EditClub() {
  const { id } = useParams();
  const clubId = Number(id);
  const { data: club } = useClub(clubId);
  const { data: seasons } = useSeasons(clubId);
  const { mutate, isLoading } = useCreateSeason(clubId);

  if (!club || !seasons) {
    return <p className="animate_pulse text-center">Chargement...</p>;
  }
  return (
    <div className="mx-auto max-w-5xl p-4">
      <Link to={"/"} className="text-muted-foreground text-sm">
        <ArrowLeft className="mr-2 inline-block h-4 w-4 align-text-top" />
        Retour au club
      </Link>

      <section id="club" className="mt-6">
        <h2 className="text-2xl font-semibold tracking-tight uppercase">
          Modifier mon club
        </h2>
        <ClubForm initialData={club} />
      </section>

      <section id="seasons" className="mt-16">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight uppercase">
          Liste des saisons
        </h2>
        <Button
          onClick={() => mutate("Nouvelle saison")}
          disabled={isLoading}
          variant="secondary"
        >
          Ajouter une saison
        </Button>
        <br />
        <br />
        <SeasonList clubId={club.id} seasons={seasons} />
      </section>

      <section id="delete" className="mt-16">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight uppercase">
          Supprimer le club
        </h2>
        <DeleteClub club={club} />
      </section>
    </div>
  );
}
