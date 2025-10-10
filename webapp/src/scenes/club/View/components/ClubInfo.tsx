import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import useAuth from "@/lib/auth/useAuth";
import { Club } from "@/lib/club/club.service";
import { MapPin, Shield } from "lucide-react";
import ClubMenu from "./ClubMenu";
import JoinClubButton from "./JoinClubButton";

export default function ClubInfo({
  club,
  isMember,
  isAdmin,
}: {
  club: Club;
  isMember: boolean;
  isAdmin: boolean;
}) {
  const { session } = useAuth();

  const address =
    club.address && club.postcode && club.city
      ? `${club.address}, ${club.postcode} ${club.city}`
      : "Adresse non renseignée.";

  const userStatus = isAdmin
    ? "Vous êtes administrateur"
    : isMember
      ? "Vous êtes membre"
      : session
        ? "Vous n'êtes pas membre"
        : "Vous n'êtes pas connecté(e)";

  return (
    <Item variant="outline">
      <ItemHeader>
        <ItemTitle>{userStatus}</ItemTitle>
      </ItemHeader>
      <ItemContent>
        <ItemDescription className="leading-relaxed">
          <Shield className="mr-2 inline-block h-4 w-4 align-text-top" />
          Créé le{" "}
          {new Date(club.created_at).toLocaleDateString("fr-FR", {
            dateStyle: "long",
          })}
          <ItemDescription className="leading-relaxed">
            <MapPin className="mr-2 inline-block h-4 w-4 align-text-top" />
            {address}
          </ItemDescription>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        {isMember ? (
          <ClubMenu isAdmin={isAdmin} clubId={club.id} />
        ) : (
          <JoinClubButton clubId={club.id} />
        )}
      </ItemActions>
    </Item>
  );
}
