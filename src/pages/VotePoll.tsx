import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { ThumbUpIcon, ShareIcon } from "@heroicons/react/solid";

// Poll structure
type Poll = {
  question: string;
  description?: string;
  options: string[];
  votes: number[];
  voters: string[];
  creatorName?: string;
};

const VotePoll = () => {
  const { id } = useParams<{ id: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(true);
  const [votedIndex, setVotedIndex] = useState<number | null>(null);

  // Fetch user's IP address
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIp(data.ip);
      } catch (err) {
        console.error("IP fetch failed", err);
      }
    };
    fetchIp();
  }, []);

  // Fetch poll data once IP is available
  useEffect(() => {
    const fetchPoll = async () => {
      if (!ip || !id) return;

      const pollRef = doc(db, "polls", id);
      const snapshot = await getDoc(pollRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as Poll;
        setPoll(data);

        if (data.voters.includes(ip)) {
          const votedOption = data.votes.findIndex(
            (vote) => vote === Math.max(...data.votes) && data.voters.includes(ip)
          );
          setVotedIndex(votedOption);
        }
      } else {
        toast.error("Poll not found");
      }

      setLoading(false);
    };

    if (ip) fetchPoll();
  }, [ip, id]);

  const handleVote = async (index: number) => {
    if (!poll || !id || !ip) return;

    if (poll.voters.includes(ip)) {
      toast.error("You’ve already voted!");
      return;
    }

    const pollRef = doc(db, "polls", id);
    const updatedVotes = [...poll.votes];
    updatedVotes[index] += 1;

    await updateDoc(pollRef, {
      votes: updatedVotes,
      voters: arrayUnion(ip),
    });

    setPoll({ ...poll, votes: updatedVotes, voters: [...poll.voters, ip] });
    setVotedIndex(index);
    toast.success("Vote submitted!");
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="text-center mb-4 text-sm text-gray-500">
        Created by{" "}
        <span className="font-medium text-indigo-600">
          {poll?.creatorName || "Unknown Pollifier 😺"}
        </span>
      </div>

      <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-4">{poll?.question}</h2>

      <p className="text-center text-gray-500 mb-8 max-w-2xl mx-auto">
        {poll?.description?.trim() || "No description provided for this poll."}
      </p>

      <ul className="space-y-4">
        {poll?.options.map((option, index) => {
          const hasVoted = poll.voters.includes(ip);
          const isVotedOption = hasVoted && index === votedIndex;

          return (
            <li key={index}>
              <button
                className={`w-full p-4 rounded-lg font-medium flex justify-between items-center transition-transform ${
                  isVotedOption
                    ? "bg-green-100 text-green-800"
                    : "bg-indigo-50 hover:bg-indigo-100 text-indigo-800"
                }`}
                onClick={() => handleVote(index)}
              >
                <span className="flex items-center space-x-2">
                  <ThumbUpIcon className={`w-5 h-5 ${isVotedOption ? "text-green-600" : "text-indigo-600"}`} />
                  <span>{option}</span>
                </span>
                <span className="text-sm text-gray-600 flex items-center space-x-2">
                  <span>{poll.votes[index]} votes</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-8 text-center">
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Poll link copied to clipboard!");
          }}
          className="text-sm text-indigo-600 hover:underline flex items-center justify-center space-x-2 bg-indigo-100 hover:bg-indigo-200 p-4 rounded-full transition duration-200"
        >
          <ShareIcon className="w-5 h-5" />
          <span>Share this poll</span>
        </button>
      </div>
    </div>
  );
};

export default VotePoll;