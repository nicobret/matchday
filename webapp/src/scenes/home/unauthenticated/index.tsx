import Guide from "../components/Guide";
import AllClubs from "./components/AllClubs";
import UpcomingGames from "./components/UpcomingGames";

export default function HomeUnauthenticated() {
  return (
    <div className="mx-auto max-w-4xl p-2 pt-4">
      <Guide />
      <UpcomingGames />
      <hr className="mb-4 mt-8" />
      <AllClubs />
    </div>
  );
}
