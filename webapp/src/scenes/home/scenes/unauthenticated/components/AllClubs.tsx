import useClubs from "@/lib/club/useClubs";
import ClubCarousel from "../../../components/ClubCarousel";

export default function AllClubs() {
  const { data: clubs, isError, isPending } = useClubs();

  return (
    <section id="clubs">
      <h2 className="font-new-amsterdam scroll-m-20 text-center text-4xl md:text-justify">
        Trouver un club
      </h2>

      {isPending ? (
        <p className="animate-pulse text-center">Chargement des clubs...</p>
      ) : isError ? (
        <p className="text-center">Une erreur est survenue.</p>
      ) : clubs.length === 0 ? (
        <p className="text-center">
          Aucun club trouvé. Créez un club pour commencer !
        </p>
      ) : (
        <ClubCarousel clubs={clubs} />
      )}
    </section>
  );
}
