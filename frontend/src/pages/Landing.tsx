
import MouseTrail2 from "@/components/MouseTrail2";



const Landing = () => {
  return (
    <div className="w-full h-screen group bg-[#FFF8F0] flex items-center justify-center">
      <div className="z-50 flex items-center justify-center  mix-blend-difference text-white relative">Landing
        <div className="absolute w-full h-full hover:scale-[4] interact"></div>
      </div>
      <MouseTrail2/>
    </div>
  );
};
export default Landing;
