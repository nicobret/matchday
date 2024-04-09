import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Book, Clipboard, MapPin, Pencil, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { clubType, userIsAdmin } from "../clubs.service";
import useStore from "@/utils/zustand";
import { buttonVariants } from "@/components/ui/button";

export default function ClubInfo({ club }: { club: clubType }) {
  const { session } = useStore();

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>
          <div className="flex gap-3 items-center">
            <Clipboard className="h-5 w-5" />
            Informations
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-3 items-center">
          <Shield className="h-5 w-5" />
          <p>
            Créé le{" "}
            {new Date(club.created_at).toLocaleDateString("fr-FR", {
              dateStyle: "long",
            })}
          </p>
        </div>

        <div className="flex gap-3">
          <MapPin className="h-5 w-5" />
          {club.address && club.postcode && club.city ? (
            <div>
              <p className="leading-relaxed">{club.address}</p>
              <p>
                {club.postcode} {club.city}
              </p>
            </div>
          ) : (
            <p className="leading-relaxed">Adresse non renseignée.</p>
          )}
        </div>

        {club.description && (
          <div className="flex gap-3">
            <Book className="h-5 w-5 flex-none" />
            <p className="leading-relaxed">{club.description}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto flex justify-end">
        {session && userIsAdmin(session.user, club) && (
          <Link
            className={buttonVariants({ variant: "secondary" })}
            to={`/clubs/${club.id}/edit`}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Modifier
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
