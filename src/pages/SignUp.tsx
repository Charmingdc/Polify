import { useState, useEffect, useRef } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (auth.currentUser) {
      navigate("/");
    }
    emailRef.current?.focus();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user to Firestore 'users' collection
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        joinedAt: serverTimestamp(),
      });

      toast.success("Account created successfully!");
      navigate("/feed");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`Failed to create account: ${error.message}`);
      } else {
        toast.error("Failed to create account due to an unknown error.");
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
          onSubmit={handleSignUp}
          className="p-10 bg-white rounded-3xl w-11/12 max-w-lg shadow-lg"
        >
          <h2 className="text-4xl font-semibold text-center text-gray-800 mb-6">
            Create an Account! 🎉
          </h2>
          <p className="text-center text-gray-500 mb-4">Sign up to get started</p>

          <input
            type="email"
            ref={emailRef}
            placeholder="Email"
            className="w-full border border-gray-300 p-4 mb-6 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-4 mb-6 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition duration-300"
          >
            Sign Up
          </button>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default SignUp;