import { useDarkMode } from "../hook/useDarkMode";
import HeaderHome from "../components/HeaderHome";
import MainHome from "../components/MainHome";
import FooterHome from "./FooterHome";

const HomePage = () => {
  const { darkMode } = useDarkMode();

  return (
    <div
      className={`w-full min-h-screen transition-colors ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
      style={{ direction: "rtl" }}
    >
      <div className="w-full max-w-[1450px] mx-auto p-4">
        <HeaderHome />
        <MainHome />
        <FooterHome/>
      </div>
    </div>
  );
};

export default HomePage;