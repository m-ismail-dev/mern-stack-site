import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/api";
import { useUser } from "../context/userContext";
import toast from "react-hot-toast";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const { setUser } = useUser();

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    console.log(email, password);

    let errors = [];

    if (firstName.length < 3)
      errors.push("First name must be at least 3 and not exceed 15 characters");

    if (lastName.length < 3)
      errors.push("Last name must be at least 3 and not exceed 15 characters");

    if (password !== passwordConfirm) errors.push("passwords do not match");

    if (errors.length > 0) return toast.error(errors.join("\n"));

    const user = await register(firstName, lastName, email, password);

    if (user.message === "Registered successfully") {
      setUser(user.user);
      navigate("/account");
    }
  }

  return (
    <main className="bg-emerald-50 flex justify-center items-center h-dvh max-w-7xl mx-auto">
      <form
        className="bg-white rounded-lg shadow-xl text-sm text-gray-500 border border-gray-200 p-8 py-12 w-80 sm:w-88"
        onSubmit={handleSubmit}
      >
        <p className="text-2xl font-medium text-center">
          <span className="text-emerald-500">User</span> Register
        </p>

        <div className="mt-4">
          <label className="block text-emerald-600">First Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            required
            minLength={3}
            maxLength="15"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className="block text-emerald-600">Last Name</label>
          <input
            type="text"
            placeholder="Enter your family name"
            required
            minLength="3"
            maxLength="15"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
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
            minLength="8"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mt-4">
          <label className="block text-emerald-600">Password Confirm</label>
          <input
            type="password"
            placeholder="******"
            required
            minLength="8"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>

        <p className="mt-4">
          Already have an account?
          <Link to="/login" className="text-emerald-500">
            Click here
          </Link>
        </p>

        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 transition-all text-white w-full py-2 rounded-md mt-4 cursor-pointer"
        >
          Register
        </button>
      </form>
    </main>
  );
}

export default Register;
