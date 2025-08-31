import Guide from "../../components/Guide";
import MyClubs from "./components/MyClubs";
import MyGames from "./components/MyGames";

export default function HomeAuthenticated() {
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 p-2 pt-4">
      <Guide />
      <MyGames />
      <hr className="mx-auto my-2 w-full md:my-4 md:w-1/2"></hr>
      <MyClubs />
    </div>
  );
}
