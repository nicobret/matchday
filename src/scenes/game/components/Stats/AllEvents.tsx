import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GameEvent } from "../../games.service";

export default function AllEvents({ gameEvents }: { gameEvents: GameEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evénements</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
