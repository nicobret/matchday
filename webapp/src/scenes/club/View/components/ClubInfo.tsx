import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import { Club } from "@/lib/club/club.service";
import { MapPin, Shield } from "lucide-react";
import ClubMenu from "./ClubMenu";

export default function ClubInfo({
  club,
  isMember,
  isAdmin,
}: {
  club: Club;
  isMember: boolean;
  isAdmin: boolean;
}) {
  const address =
    club.address && club.postcode && club.city
      ? `${club.address}, ${club.postcode} ${club.city}`
      : "Adresse non renseignée.";

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>{club.description}</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <ItemDescription>
          <Shield className="mr-2 inline-block h-4 w-4 align-text-top" />
          Créé le{" "}
          {new Date(club.created_at).toLocaleDateString("fr-FR", {
            dateStyle: "long",
          })}
          <ItemDescription>
            <MapPin className="mr-2 inline-block h-4 w-4 align-text-top" />
            {address}
          </ItemDescription>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <ClubMenu isMember={isMember} isAdmin={isAdmin} clubId={club.id} />
      </ItemActions>
    </Item>
  );
}
