import { Link } from "react-router-dom";

function Button({ href, children }) {
  return (
    <Link to={href}>
      <button className="inset-0 bg-emerald-950/50 rounded-xl mx-1 px-5 py-2 text-white text-2xl cursor-pointer">
        {children}
      </button>
    </Link>
  );
}

export default Button;
