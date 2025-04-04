
// src/pages/MyPolls.tsx

import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import { EyeIcon, TrashIcon } from "@heroicons/react/solid";
import toast from "react-hot-toast";
import { Dialog } from "@headlessui/react";

const MyPolls = () => {
  const [polls, setPolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [pollToDelete, setPollToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolls = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const q = query(collection(db, "polls"), where("createdBy", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPolls(docs);
      } catch (error) {
        console.error("Error fetching polls:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, []);

  const handleDeletePoll = async () => {
    if (!pollToDelete) return;

    setLoading(true);
    try {
      await deleteDoc(doc(db, "polls", pollToDelete));
      toast.success("Poll deleted successfully!");

      setIsDeleteDialogOpen(false);
      setPollToDelete(null);
      setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollToDelete));
    } catch (error) {
      console.error("Error deleting poll:", error);
      toast.error("Failed to delete poll.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-600">My Polls</h2>

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
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">{poll.question}</h3>
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
            <Dialog.Title className="text-2xl font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </Dialog.Title>
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