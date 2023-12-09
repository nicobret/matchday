import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <Header />
      <Outlet />
    </div>
  );
}
