import { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "./Loader";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

const Navbar = () => {
  const [user, loading] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);

  if (loading) return <Loader />;

  return (
    <nav className="w-full bg-white bg-opacity-20 backdrop-blur-lg border-b border-indigo-600 shadow-sm px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-semibold text-indigo-600 tracking-tight hover:opacity-90 transition"
        >
          Pollify
        </Link>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-indigo-600">
            {isOpen ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/create" className="text-gray-700 hover:text-indigo-600 transition font-medium">Create</Link>
              <Link to="/mypolls" className="text-gray-700 hover:text-indigo-600 transition font-medium">My Polls</Link>
              <button
                onClick={() => auth.signOut()}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-1.5 rounded-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-indigo-600 transition font-medium">Login</Link>
              <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md transition font-medium shadow-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3">
          {user ? (
            <>
              <Link to="/create" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-indigo-600 transition font-medium">Create</Link>
              <Link to="/mypolls" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-indigo-600 transition font-medium">My Polls</Link>
              <button
                onClick={() => {
                  auth.signOut();
                  setIsOpen(false);
                }}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-1.5 rounded-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-indigo-600 transition font-medium">Login</Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md transition font-medium shadow-sm">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;