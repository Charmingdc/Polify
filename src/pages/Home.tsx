import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "../firebase";
import {
  PencilAltIcon,
  ChartBarIcon,
  ShareIcon,
} from "@heroicons/react/solid";

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
    <div className="bg-white text-gray-800">
      <div className="max-w-4xl mx-auto px-6 py-4 text-center">
        <img
          src="/pollify.png"
          alt="Pollify logo"
          className="mx-auto -mb-4 w-[60%] h-[12rem]"
        />

        <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-600 mb-6 leading-tight">
          Welcome to Pollify
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          Create and share beautiful polls effortlessly. Collect opinions, make
          decisions, and engage your audience—all in one place.
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

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-12">
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-5xl mx-auto px-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center hover:shadow-md transition duration-200">
            <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-6">
              <PencilAltIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Poll Creation</h3>
            <p className="text-gray-600">
              Easily create and customize polls with options to collect valuable feedback.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center hover:shadow-md transition duration-200">
            <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-6">
              <ChartBarIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-Time Results</h3>
            <p className="text-gray-600">
              View poll results instantly as your audience participates.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center hover:shadow-md transition duration-200">
            <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-6">
              <ShareIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Share Polls</h3>
            <p className="text-gray-600">
              Share polls easily on social media or through direct links to engage your audience.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-600 space-y-3 text-sm">
          <p>Created with 🔥 by Charmingdc</p>
          <p>
            Follow on{" "}
            <a
              href="https://x.com/Charmingdc01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              X (Twitter)
            </a>{" "}
            |{" "}
            <a
              href="https://github.com/Charmingdc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              GitHub
            </a>
          </p>
          <p>© {new Date().getFullYear()} Pollify</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;