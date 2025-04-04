import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState(""); // State for description
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const [pollType, setPollType] = useState<"public" | "private">("private");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown state
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  const handleAddOption = () => {
    setOptions((prev) => [...prev, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)));
  };

  const isValidPoll = () => {
    const validOptions = options.filter((opt) => opt.trim() !== "");
    return question.trim() !== "" && validOptions.length >= 2;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    if (!isValidPoll()) {
      toast.error("Poll must have a question and at least two options.");
      return;
    }

    setLoading(true);
    try {
      const cleanOptions = options.filter((opt) => opt.trim() !== "");
      const email = auth.currentUser.email || "anonymous@poll.com";
      const creatorName = email.split("@")[0];

      const newPoll = {
        question: question.trim(),
        description: description.trim(),
        options: cleanOptions,
        votes: Array(cleanOptions.length).fill(0),
        createdBy: auth.currentUser.uid,
        creatorName,
        createdAt: serverTimestamp(),
        voters: [],
        type: pollType,
      };

      const docRef = await addDoc(collection(db, "polls"), newPoll);
      toast.success("Poll created!");
      navigate(`/poll/${docRef.id}`);
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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
        Create a New Poll
      </h2>

      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white shadow-lg rounded-xl p-8 border border-gray-200"
        >
          <input
            type="text"
            placeholder="What do you want to ask?"
            className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <textarea
            placeholder="Describe your poll (optional)"
            className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />

          {options.map((option, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Option ${i + 1}`}
              className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              value={option}
              onChange={(e) => handleOptionChange(i, e.target.value)}
            />
          ))}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddOption}
              className="text-indigo-600 font-medium hover:underline transition"
            >
              + Add another option
            </button>
          </div>

          {/* Custom Public/Private Dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Poll Visibility
            </label>
            <div
              className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {pollType === "private"
                ? "Private (only you can share the link)"
                : "Public (visible to all users)"}
            </div>
            {isDropdownOpen && (
              <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                <div
                  onClick={() => {
                    setPollType("private");
                    setIsDropdownOpen(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-indigo-50"
                >
                  Private (only you can share the link)
                </div>
                <div
                  onClick={() => {
                    setPollType("public");
                    setIsDropdownOpen(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-indigo-50"
                >
                  Public (visible to all users)
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-shadow shadow-md"
          >
            Create Poll
          </button>
        </form>
      )}
    </div>
  );
};

export default CreatePoll;