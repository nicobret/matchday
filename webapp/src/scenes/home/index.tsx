import useAuth from "@/lib/auth/useAuth";
import HomeAuthenticated from "./scenes/authenticated";
import HomeUnauthenticated from "./scenes/unauthenticated";

export default function Home() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <HomeAuthenticated />;
  }
  return <HomeUnauthenticated />;
}
