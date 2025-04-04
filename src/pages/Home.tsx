import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "../firebase";

const Home = () => {
  const [totalPolls, setTotalPolls] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [pollSnap, userSnap] = await Promise.all([
          getCountFromServer(collection(db, "polls")),
          getCountFromServer(collection(db, "users")),
        ]);
        setTotalPolls(pollSnap.data().count);
        setTotalUsers(userSnap.data().count);
      } catch (error) {
        console.error("Failed to fetch counts:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 -mt-20 relative overflow-hidden">
      <div className="max-w-2xl w-full text-center relative z-10">

        {/* Logo */}
        <img 
          src="/pollify.png"
          width="200" 
          height="60"
          alt="Pollify logo"
          className="mx-auto mb-2"
        />

        <h1 className="text-5xl font-extrabold text-indigo-600 mb-6 leading-tight">
          Welcome to Pollify
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          Create and share beautiful polls effortlessly. Collect opinions, make decisions, and engage your audience—all in one place.
        </p>

        {(totalPolls !== null || totalUsers !== null) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 animate-fade-in">
            {totalPolls !== null && (
              <span className="inline-block bg-indigo-50 text-indigo-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm">
                {totalPolls.toLocaleString()}+ polls created
              </span>
            )}
            {totalUsers !== null && (
              <span className="inline-block bg-green-50 text-green-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm">
                {totalUsers.toLocaleString()}+ users joined
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/create"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition"
          >
            Create a Poll
          </Link>
          <Link
            to="/signup"
            className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-medium transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;