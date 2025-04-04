import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/outline";
import Loader from "../components/Loader";

interface Poll {
  id: string;
  question: string;
  description?: string;
  type?: string;
  createdAt?: { seconds: number };
}

const PublicFeed = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const q = query(collection(db, "polls"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const publicPolls = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Poll))
          .filter(poll => poll.type === "public");

        setPolls(publicPolls);
      } catch (error) {
        console.error("Error fetching polls:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 leading-tight">
            Discover Public Polls
          </h1>
          <p className="text-gray-600 mt-2 text-base sm:text-lg max-w-2xl mx-auto">
            Dive into community opinions. Browse and vote on public polls created by users.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center mt-24">
            <Loader />
          </div>
        ) : polls.length === 0 ? (
          <div className="text-center text-gray-500 mt-24">
            <p className="text-lg font-medium">No public polls found.</p>
            <p className="text-sm mt-2">Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {polls.map(poll => (
              <div
                key={poll.id}
                className="bg-white/70 backdrop-blur-md border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
              >
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">
                    {poll.question}
                  </h2>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {poll.description?.trim()
                      ? poll.description
                      : "No description provided for this poll."}
                  </p>

                  {poll.createdAt && (
                    <p className="text-xs text-gray-400">
                      Created on:{" "}
                      {new Date(poll.createdAt.seconds * 1000).toLocaleString()}
                    </p>
                  )}

                  <Link
                    to={`/poll/${poll.id}`}
                    className="inline-flex items-center gap-2 text-sm text-indigo-600 font-medium hover:underline"
                  >
                    <EyeIcon className="w-5 h-5" />
                    <span>View Poll</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicFeed;