import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 -mt-20 relative overflow-hidden">
      {/* Content */}
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
        <p className="text-gray-600 text-lg mb-8">
          Create and share beautiful polls effortlessly. Collect opinions, make decisions, and engage your audience—all in one place.
        </p>

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