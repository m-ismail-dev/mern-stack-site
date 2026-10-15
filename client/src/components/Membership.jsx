import { Link } from "react-router-dom";

function Membership() {
  return (
    <div className="flex justify-between items-center max-w-7xl mx-auto mt-10 rounded-2xl px-10 py-8 bg-emerald-500">
      <div className="flex flex-col justify-between items-baseline gap-10">
        <h2 className="text-2xl font-bold text-emerald-950">
          Ashgal <span className="text-emerald-50">Membership</span>
        </h2>
        <h1 className="text-3xl font-semibold text-emerald-950">
          Convert your skills into source of income
        </h1>
        <Link to="/login">
          <button className="bg-emerald-100 px-8 py-4 rounded-full text-xl font-semibold cursor-pointer hover:bg-emerald-800 hover:text-emerald-100">
            Join Now <span className="ml-4">→</span>
          </button>
        </Link>
      </div>
      <div>
        <img src="card.png" alt="Creidt Card" width={500} />
      </div>
    </div>
  );
}

export default Membership;
