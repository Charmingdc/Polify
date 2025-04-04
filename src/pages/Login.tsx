import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

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
      navigate("/mypolls");
    } catch (error: unknown) {
     if (error instanceof Error) {
      toast.error(`Failed to create poll: ${error.message}`);
     } else {
      toast.error("Failed to create poll due to an unknown error.");
     }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-2xl w-full max-w-md h-full"
        >
          <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Login</h2>
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 mb-4 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 mb-6 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition duration-300"
          >
            Login
          </button>
        </form>
      )}
    </div>
  );
};

export default Login;