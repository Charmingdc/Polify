import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddOption = () => {
    setOptions((prev) => [...prev, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? value : opt))
    );
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
      const newPoll = {
        question: question.trim(),
        options: cleanOptions,
        votes: Array(cleanOptions.length).fill(0),
        createdBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        voters: [],
      };

      const docRef = await addDoc(collection(db, "polls"), newPoll);
      toast.success("Poll created!");
      navigate(`/poll/${docRef.id}`);
    } catch (error: Error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Create a New Poll
      </h2>

      {loading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white shadow-md rounded-xl p-6 border border-gray-100"
        >
          <input
            type="text"
            placeholder="What do you want to ask?"
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          {options.map((option, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Option ${i + 1}`}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
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

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition shadow"
          >
            Create Poll
          </button>
        </form>
      )}
    </div>
  );
};

export default CreatePoll;