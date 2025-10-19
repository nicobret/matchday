import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { MinusIcon, PlusIcon } from "lucide-react";

export default function NumberInput({
  value,
  setValue,
}: {
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <ButtonGroup orientation="vertical" className="h-fit">
      <Button
        onClick={() => setValue((value: number) => value + 1)}
        variant="outline"
      >
        <PlusIcon />
      </Button>
      <Button variant="outline" className="py-6 text-2xl">
        {value}
      </Button>
      <Button
        onClick={() => setValue((value) => Math.max(0, value - 1))}
        variant="outline"
      >
        <MinusIcon />
      </Button>
    </ButtonGroup>
  );
}
