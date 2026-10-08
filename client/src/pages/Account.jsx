import MainNav from "../components/MainNav";
import SideNav from "../components/SideNav";
import { useUser } from "../context/userContext";

function Account() {
  const { user } = useUser();

  return (
    <div className="grid grid-rows-[4rem_1fr] min-h-dvh min-w-full">
      <MainNav />
      <div className="grid grid-cols-[16rem_1fr] h-full gap-2 bg-emerald-50 p-5 w-full max-w-7xl mx-auto">
        <SideNav />
        <div className="flex flex-col justify-center items-center pt-10">
          <div>Welcom {user.firstName}</div>
          <div>Here is the content</div>
        </div>
      </div>
    </div>
  );
}

export default Account;
