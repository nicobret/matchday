import useAuth from "@/lib/auth/useAuth";
import HomeAuthenticated from "./authenticated";
import HomeUnauthenticated from "./unauthenticated";

export default function Home() {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) {
    return <HomeAuthenticated />;
  }
  return <HomeUnauthenticated />;
}
