import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "./Loader";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

const Navbar = () => {
  const [user, loading] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) return <Loader />;

  const handleLogout = () => {
    auth.signOut();
    setIsOpen(false);
    
    navigate('/login');
  };

  const handleLinkClick = () => setIsOpen(false); // Closes menu when a link is clicked

  const renderLinks = () => {
    if (user) {
      return (
        <>
          <Link
            to="/feed"
            onClick={handleLinkClick}
            className="text-gray-700 hover:text-indigo-600 transition font-medium">
            Feed
          </Link>
          <Link
            to="/create"
            onClick={handleLinkClick}
            className="text-gray-700 hover:text-indigo-600 transition font-medium"
          >
            Create
          </Link>
          <Link
            to="/mypolls"
            onClick={handleLinkClick}
            className="text-gray-700 hover:text-indigo-600 transition font-medium"
          >
            My Polls
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-3 py-1.5 rounded-md transition"
          >
            Logout
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link
            to="/login"
            onClick={handleLinkClick}
            className="text-gray-700 hover:text-indigo-600 transition font-medium"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={handleLinkClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md transition font-medium shadow-sm"
          >
            Sign Up
          </Link>
        </>
      );
    }
  };

  return (
    <nav className="w-full bg-white bg-opacity-20 backdrop-blur-lg border-b border-indigo-600 shadow-sm px-6 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          onClick={handleLinkClick}
          className="text-2xl font-semibold text-indigo-600 tracking-tight hover:opacity-90 transition"
        >
          Pollify
        </Link>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-indigo-600">
            {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {renderLinks()}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3">
          {renderLinks()}
        </div>
      )}
    </nav>
  );
};

export default Navbar;