import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Club } from "@/lib/club/club.service";
import ClubCard from "./ClubCard";

export default function ClubCarousel({ clubs }: { clubs: Club[] }) {
  return (
    <Carousel>
      <CarouselContent>
        {clubs
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .map((club) => (
            <CarouselItem key={club.id} className="sm:basis-1/2 md:basis-1/3">
              <ClubCard club={club} />
            </CarouselItem>
          ))}
        <CarouselPrevious />
        <CarouselNext />
      </CarouselContent>
    </Carousel>
  );
}
