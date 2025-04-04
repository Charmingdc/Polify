import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect authenticated users to the homepage or dashboard
  useEffect(() => {
    if (auth.currentUser) {
      navigate("/mypolls"); // Change to the desired route for authenticated users
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/feed");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Login failed: ${error.message}`);
      } else {
        toast.error("Login failed due to an unknown error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-indigo-300 to-blue-200 overflow-hidden">
      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-10 bg-white rounded-3xl w-11/12 max-w-lg shadow-lg"
        >
          <h2 className="text-4xl font-semibold text-center text-gray-800 mb-6">
            Welcome Back! 👋
          </h2>
          <p className="text-center text-gray-500 mb-4">Please log in to your account</p>

          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 p-4 mb-6 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-4 mb-6 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;