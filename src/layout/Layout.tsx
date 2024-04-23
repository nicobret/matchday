import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="max-w-screen-xl mx-auto">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
