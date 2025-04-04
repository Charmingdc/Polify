import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import { EyeIcon } from "@heroicons/react/outline";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-10">
          Public Polls Feed
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading polls...</p>
        ) : polls.length === 0 ? (
          <p className="text-center text-gray-500">No public polls found.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {polls.map(poll => (
              <div
                key={poll.id}
                className="bg-white/90 backdrop-blur-md border border-gray-200 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 space-y-2"
              >
                <h2 className="text-xl font-semibold text-gray-800">
                  {poll.question}
                </h2>

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
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
                  className="inline-flex items-center text-sm text-indigo-600 font-medium hover:underline"
                >
                  <EyeIcon className="w-5 h-5 mr-1" />
                  View Poll
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicFeed;