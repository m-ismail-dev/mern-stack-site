// import { useEffect } from "react";
import MainNav from "../components/MainNav";
import SideNav from "../components/SideNav";
import { getMe } from "../api/api";

function Account() {
  // useEffect(function () {
  //   const user = async () => await getMe();

  //   console.log(user);
  // }, []);

  async function handleClick() {
    const user = await getMe();

    console.log(user);
  }
  return (
    <div className="grid grid-rows-[4rem_1fr] min-h-dvh min-w-full">
      <MainNav />
      <div className="grid grid-cols-[16rem_1fr] h-full gap-2 bg-emerald-50 p-5 w-full max-w-7xl mx-auto">
        <SideNav />
        <div className="flex flex-col justify-center items-center pt-10">
          <div>Here is the content</div>
          <button className="mt-5 cursor-pointer" onClick={handleClick}>
            click me
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;
