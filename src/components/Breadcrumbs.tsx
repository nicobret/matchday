import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

function Breadcrumbs({ links }: { links: { label: string; link: string }[] }) {
  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Link to="/">
        <Home className="h-4 w-4" />
      </Link>
      <ChevronRight className="h-4 w-4" />
      {links.map((l, i) => (
        <div key={i} className="flex items-center gap-1">
          <Link to={l.link}>{l.label}</Link>
          {i < links.length - 1 && <ChevronRight className="h-4 w-4" />}
        </div>
      ))}
    </div>
  );
}

export { Breadcrumbs };
