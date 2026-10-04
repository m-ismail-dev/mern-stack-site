import { Link } from "react-router-dom";

function Button({ href, children }) {
  return (
    <Link to={href}>
      <button className="inset-0 bg-emerald-950/50 border border-emerald-950 rounded-xl mx-1 px-5 py-2 text-white text-2xl cursor-pointer hover:bg-emerald-950/70">
        {children}
      </button>
    </Link>
  );
}

export default Button;
