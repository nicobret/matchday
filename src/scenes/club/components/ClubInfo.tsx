import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Book, Clipboard, MapPin, Pencil, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Club, isAdmin } from "../club.service";
import { buttonVariants } from "@/components/ui/button";
import { useContext } from "react";
import { SessionContext } from "@/components/auth-provider";

export default function ClubInfo({ club }: { club: Club }) {
  const { session } = useContext(SessionContext);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-3">
            <Clipboard className="h-5 w-5" />
            Informations
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
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
        {session?.user && isAdmin(session?.user, club) && (
          <Link
            className={buttonVariants({ variant: "secondary" })}
            to={`/club/${club.id}/edit`}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
