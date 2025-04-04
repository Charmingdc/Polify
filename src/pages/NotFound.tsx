import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-0 -mt-20 overflow-hidden">
      <div className="text-center max-w-md w-full">
        <h1 className="text-6xl font-extrabold text-indigo-600 mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">Oops! The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;