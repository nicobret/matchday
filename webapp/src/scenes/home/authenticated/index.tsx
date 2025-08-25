import Guide from "../components/Guide";
import MyClubs from "./components/MyClubs";
import MyGames from "./components/MyGames";

export default function HomeAuthenticated() {
  return (
    <div className="mx-auto max-w-4xl p-2 pt-4">
      <Guide />
      <MyGames />
      <br />
      <MyClubs />
    </div>
  );
}
