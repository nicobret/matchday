import Guide from "../../components/Guide";
import AllClubs from "./components/AllClubs";
import UpcomingGames from "./components/UpcomingGames";

export default function HomeUnauthenticated() {
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 p-2 pt-4">
      <Guide />
      <UpcomingGames />
      <hr className="mx-auto my-2 w-full md:my-4 md:w-1/2"></hr>
      <AllClubs />
    </div>
  );
}
