import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Member } from "@/lib/club/club.service";
import { useUpdateMember } from "@/lib/member/useUpdateMember";
import { toast } from "sonner";

export function RoleSelector({
  member,
  enabled,
}: {
  member: Member;
  enabled: boolean;
}) {
  const { mutate, isPending } = useUpdateMember(member);

  const options = [
    { value: "member", label: "Membre" },
    { value: "admin", label: "Admin" },
  ];

  const selectedOption = options.find((option) => option.value === member.role);

  return (
    <Select
      onValueChange={(role) =>
        mutate(
          { role },
          {
            onSuccess: () => {
              toast.success("Rôle mis à jour");
            },
          },
        )
      }
      value={selectedOption?.value}
      disabled={!enabled || isPending}
    >
      <SelectTrigger className="w-fit">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
