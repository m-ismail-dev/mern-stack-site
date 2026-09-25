import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    console.log(email, password);
  }

  return (
    <main className="flex justify-center items-center h-dvh">
      <form
        className="bg-white rounded-lg shadow-xl text-sm text-gray-500 border border-gray-200 p-8 py-12 w-80 sm:w-88"
        onSubmit={handleSubmit}
      >
        <p className="text-2xl font-medium text-center">
          <span className="text-emerald-500">User</span> Login
        </p>

        <div className="mt-4">
          <label className="block text-emerald-600">Email</label>
          <input
            type="email"
            placeholder="email@example.com"
            required
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="block text-emerald-600">Password</label>
          <input
            type="password"
            placeholder="******"
            required
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* <p className="mt-4">
          Create an account?
          <a href="#" className="text-emerald-500">
            Click here
          </a>
        </p> */}

        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 transition-all text-white w-full py-2 rounded-md mt-4 cursor-pointer"
        >
          Login
        </button>
      </form>
    </main>
  );
}

export default Login;
