import ClubSection from "./components/ClubSection";
import GameSection from "./components/GameSection";
import Guide from "./components/Guide";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 p-4">
      <Guide />
      <ClubSection />
      <GameSection />
    </div>
  );
}
