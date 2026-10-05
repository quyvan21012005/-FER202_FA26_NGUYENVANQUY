import Header from "./components/Header";
import Content from "./components/Content";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
  // App KHÔNG cần biết gì về theme và KHÔNG cần truyền props
  return (
    <div className="app-container">
      <Header />
      <Content />
      <Footer />
    </div>
  );
}
