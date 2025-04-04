import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect authenticated users to the homepage or dashboard
  useEffect(() => {
    if (auth.currentUser) {
      navigate("/"); // Change to the desired route for authenticated users
    }
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/create");
    } catch (error: any) {
      alert(error.message);
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
          onSubmit={handleSignUp}
          className="p-8 rounded-2xl w-full max-w-md h-full"
        >
          <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Sign Up</h2>
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
            {loading ? <Loader size={20} /> : "Sign Up"}
          </button>
        </form>
      )}
    </div>
  );
};

export default SignUp;