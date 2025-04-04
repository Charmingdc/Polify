import { useState, useEffect, useRef } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={handleSignUp}
          className="p-8 rounded-2xl w-full max-w-md"
        >
          <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Sign Up</h2>

          <input
            type="email"
            ref={emailRef}
            placeholder="Email"
            className="w-full border p-3 mb-4 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 mb-6 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500"
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
        </form>
      )}
    </div>
  );
};

export default SignUp;