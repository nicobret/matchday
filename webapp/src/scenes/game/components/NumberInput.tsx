import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { MinusIcon, PlusIcon } from "lucide-react";

export default function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <ButtonGroup orientation="vertical" className="h-fit font-mono">
      <Button onClick={() => onChange(value + 1)} variant="outline">
        <PlusIcon />
      </Button>
      <Button variant="outline" className="h-11 p-0 text-2xl">
        {value}
      </Button>
      <Button
        onClick={() => onChange(Math.max(0, value - 1))}
        variant="outline"
      >
        <MinusIcon />
      </Button>
    </ButtonGroup>
  );
}
