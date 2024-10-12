import { Breadcrumbs } from "@/components/Breadcrumbs";
import useSeasons from "@/scenes/club/lib/useSeasons";
import { useParams } from "react-router-dom";
import useClub from "../lib/useClub";
import ClubForm from "./ClubForm";
import SeasonList from "./SeasonList";

export default function EditClub() {
  const { id } = useParams();
  const { data: club } = useClub(Number(id));
  const { data: seasons } = useSeasons(Number(id));
  if (!club || !seasons) {
    return <p className="animate_pulse text-center">Chargement...</p>;
  }
  return (
    <div className="p-4">
      <Breadcrumbs
        links={[
          { label: club.name || "", link: `/club/${id}` },
          { label: "Modifier", link: "#" },
        ]}
      />

      <section id="club" className="mt-6">
        <h2 className="mb-2 text-3xl font-semibold tracking-tight">
          Modifier mon club
        </h2>
        <ClubForm initialData={club} />
      </section>

      <section id="seasons" className="mt-12">
        <h2 className="mb-4 text-3xl font-semibold tracking-tight">
          Gérer les saisons
        </h2>
        <SeasonList clubId={club.id} seasons={seasons} />
      </section>
    </div>
  );
}
