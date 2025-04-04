import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc, orderBy, QuerySnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { EyeIcon, TrashIcon } from "@heroicons/react/solid";
import toast from "react-hot-toast";
import { Dialog } from "@headlessui/react";
import { User } from "firebase/auth"; // Add this import
import { Timestamp } from "firebase/firestore"; // Add this import

// Define poll structure
type Poll = {
  id: string;
  question: string;
  description?: string;
  createdBy: string;
  options: string[];
  votes: number[];
  voters: string[];
  createdAt: Timestamp; // Firebase timestamp field
};

const MyPolls = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pollToDelete, setPollToDelete] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Store user state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchPolls = async () => {
      try {
        const pollsQuery = query(
          collection(db, "polls"),
          where("createdBy", "==", currentUser.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot: QuerySnapshot = await getDocs(pollsQuery);
        const fetchedPolls = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Poll[];

        setPolls(fetchedPolls);
      } catch (error) {
        console.error("Error fetching polls:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [currentUser]);

  const handleDeletePoll = async () => {
    if (!pollToDelete) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, "polls", pollToDelete));
      toast.success("Poll deleted successfully!");
      setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollToDelete));
    } catch (error) {
      toast.error("Failed to delete poll.");
      console.error("Error deleting poll:", error);
    } finally {
      setIsDeleteDialogOpen(false);
      setPollToDelete(null);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2">My Polls</h2>
      <p className="text-center text-gray-600 mb-6">
        You’ve created <span className="font-semibold text-indigo-600">{polls.length}</span>{" "}
        {polls.length === 1 ? "poll" : "polls"}.
      </p>

      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <ul className="space-y-6">
          {polls.map((poll) => (
            <li
              key={poll.id}
              className="bg-white p-6 rounded-lg border border-gray-200 transition-transform transform hover:scale-105 hover:border-indigo-500"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-2 line-clamp-1">{poll.question}</h3>

              {poll.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{poll.description}</p>
              )}

              <div className="flex justify-between items-center space-x-6">
                <Link
                  to={`/poll/${poll.id}`}
                  className="text-indigo-600 hover:text-indigo-700 flex items-center space-x-2 font-medium text-sm transition-all"
                >
                  <EyeIcon className="w-5 h-5" />
                  <span>View / Share</span>
                </Link>

                <button
                  onClick={() => {
                    setPollToDelete(poll.id);
                    setIsDeleteDialogOpen(true);
                  }}
                  className="text-red-600 hover:text-red-800 font-medium flex items-center space-x-2 text-sm transition-all"
                >
                  <TrashIcon className="w-5 h-5" />
                  <span>Delete Poll</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <Dialog.Panel className="bg-white p-8 rounded-lg max-w-sm mx-auto w-full">
            <Dialog.Title className="text-2xl font-semibold text-gray-800 mb-4">Confirm Deletion</Dialog.Title>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this poll? This action cannot be undone.
            </p>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePoll}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
              >
                Delete Poll
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default MyPolls;