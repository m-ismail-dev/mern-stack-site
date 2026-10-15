import Button from "../components/Button";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { TbUsersGroup } from "react-icons/tb";

function HeroSection() {
  return (
    <div className="relative max-w-7xl h-150 w-[1000] mx-auto mt-10 rounded-2xl overflow-hidden bg-[url(bg.jpg)] bg-cover bg-center bg-no-repeat flex justify-center items-center">
      <div className="relative flex flex-col justify-center items-center z-10 inset-0 bg-black/70 mt-20 px-8 py-8 rounded-2xl">
        <div className="inset-0 rounded-xl p-5">
          <h1 className="text-white text-5xl">Sudan's biggest labour site</h1>
        </div>
        <div className="mt-5">
          <Button href="/login">Ask for service &rarr;</Button>
          <Button href="/login">Search for service</Button>
        </div>
        <div className="flex gap-4">
          <div className="flex justify-center items-center text-lg text-white gap-2 mt-5">
            <MdOutlineVerifiedUser />
            <p>Verified</p>
          </div>
          <div className="flex justify-center items-center text-lg text-white gap-2 mt-5">
            <TbUsersGroup />
            <p>Trusted</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
