import ClubSection from "./components/ClubSection";
import GameSection from "./components/GameSection";
import Guide from "./components/Guide";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl p-2">
      <Guide />
      <GameSection />
      <ClubSection />
    </div>
  );
}
