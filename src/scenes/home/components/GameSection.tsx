import GameCard from "@/scenes/club/components/GameCard";
import useGames from "@/scenes/game/lib/game/useGames";

export default function GameSection() {
  const { data: games, isPending, isError } = useGames({ filter: "next" });
  return (
    <section id="games">
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight">
        Matches
      </h2>
      <p className="mt-4">
        Trouvez un match à jouer ou inscrivez-vous à un match déjà créé.
      </p>
      {isPending ? (
        <p className="mt-4 text-center">Chargement des matchs...</p>
      ) : isError ? (
        <p className="mt-4 text-center">
          Une erreur est survenue lors du chargement des matchs.
        </p>
      ) : games.length === 0 ? (
        <p className="mt-4 text-center">
          Aucun match trouvé. Créez un match pour commencer !
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </section>
  );
}
