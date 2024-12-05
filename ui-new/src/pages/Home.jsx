import CreateEarnHome from "../components/home/CreateEarnHome";
import HeroHome from "../components/home/HeroHome";
import LiveHome from "../components/home/LiveHome";
import ProcessHome from "../components/home/ProcessHome";
import UpcommingHome from "../components/home/UpcommingHome";

import { register } from "swiper/element/bundle";
// register Swiper custom elements
register();

const Home = () => {
  return (
    <>
      <HeroHome />
      <div className="p-5">
        <LiveHome />
        <UpcommingHome />
        <ProcessHome />
        <div className="text-white w-100">
          <CreateEarnHome />
        </div>
      </div>
    </>
  );
};

export default Home;
