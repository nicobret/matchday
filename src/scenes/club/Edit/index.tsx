import { Button } from "@/components/ui/button";
import { queryClient } from "@/lib/react-query";
import useSeasons from "@/scenes/club/lib/useSeasons";
import supabase from "@/utils/supabase";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "wouter";
import useClub from "../lib/useClub";
import ClubForm from "./ClubForm";
import DeleteClub from "./DeleteClub";
import SeasonList from "./SeasonList";

export default function EditClub() {
  const { id } = useParams();
  const { data: club } = useClub(Number(id));
  const { data: seasons } = useSeasons(Number(id));

  if (!club || !seasons) {
    return <p className="animate_pulse text-center">Chargement...</p>;
  }

  async function handleCreateSeason() {
    await supabase
      .from("season")
      .insert({ club_id: club!.id, name: "Nouvelle saison" });
    queryClient.invalidateQueries("seasons");
  }

  return (
    <div className="mx-auto max-w-5xl p-4">
      <Link to={`/club/${id}`} className="text-sm text-muted-foreground">
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
        <Button onClick={handleCreateSeason} variant="secondary">
          Ajouter une saison
        </Button>
        <br />
        <br />
        <SeasonList clubId={club.id} seasons={seasons} />
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
