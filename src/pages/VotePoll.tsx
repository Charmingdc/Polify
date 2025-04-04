import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { LinkIcon } from "@heroicons/react/solid";

// Poll structure
type Poll = {
  question: string;
  options: string[];
  votes: number[];
  voters: string[];
};

const VotePoll = () => {
  const { id } = useParams<{ id: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [ip, setIp] = useState("");
  const [loading, setLoading] = useState(true);
  const [votedIndex, setVotedIndex] = useState<number | null>(null);

  // 1. Get IP
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

  // 2. Fetch poll only after IP is ready
  useEffect(() => {
    const fetchPoll = async () => {
      if (!ip || !id) return;

      const pollRef = doc(db, "polls", id);
      const snapshot = await getDoc(pollRef);

      if (snapshot.exists()) {
        const data = snapshot.data() as Poll;
        setPoll(data);

        if (data.voters.includes(ip)) {
          // Find which option they voted for
          const index = data.votes.findIndex((vote) => {
            const max = Math.max(...data.votes);
            return vote === max && data.voters.includes(ip);
          });

          setVotedIndex(index);
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
    <div className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-4 text-center">{poll?.question}</h2>
      <ul className="space-y-3">
        {poll?.options.map((option, i) => {
          const hasVoted = poll.voters.includes(ip);
          const isVotedOption = hasVoted && i === votedIndex;

          return (
            <li key={i}>
              <button
                className={`w-full p-3 rounded-md font-medium flex justify-between items-center transition ${
                  isVotedOption
                    ? "bg-green-100 text-green-800"
                    : "bg-indigo-50 hover:bg-indigo-100 text-indigo-800"
                }`}
                onClick={() => handleVote(i)}
              >
                <span>{option}</span>
                <span className="text-sm text-gray-600">
                  {poll.votes[i]} votes
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 text-center">
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Poll link copied!");
          }}
          className="text-sm text-indigo-600 hover:underline flex items-center justify-center space-x-2 bg-indigo-100 hover:bg-indigo-200 p-3 rounded-full mt-4"
        >
          <LinkIcon className="w-5 h-5" />
          <span>Share this poll</span>
        </button>
      </div>
    </div>
  );
};

export default VotePoll;