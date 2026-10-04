import { FaHistory, FaRegCreditCard, FaUser } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { Link } from "react-router-dom";

const links = [
  {
    icon: <FaHistory />,
    name: "Work history",
    href: "",
  },
  {
    icon: <FaRegCreditCard />,
    name: "Bills",
    href: "",
  },
  {
    icon: <FaUser />,
    name: "Profile",
    href: "",
  },
];

function SideNav() {
  return (
    <nav className="border-r border-emerald-950 py-5">
      <ul className="flex flex-col gap-4 h-full">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              className={`py-3 px-5 hover:bg-emerald-900 hover:text-emerald-100 transition-colors flex items-center gap-4 font-semibold text-emerald-800`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          </li>
        ))}
        <li className="mt-auto">
          <Link
            className={`py-3 px-5 hover:bg-emerald-900 hover:text-emerald-100 transition-colors flex items-center gap-4 font-semibold text-emerald-800`}
          >
            <TbLogout2 />
            <span>Logout</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default SideNav;
