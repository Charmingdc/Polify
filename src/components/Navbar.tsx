import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Loader from "./Loader";
import {
  MenuIcon,
  XIcon,
  ClipboardListIcon,
  PencilAltIcon,
  CollectionIcon,
  LogoutIcon,
  LoginIcon,
  UserAddIcon,
} from "@heroicons/react/outline";

const Navbar = () => {
  const [user, loading] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) return <Loader />;

  const handleLogout = () => {
    auth.signOut();
    setIsOpen(false);
    navigate("/login");
  };

  const handleLinkClick = () => setIsOpen(false);

  const renderLinks = () => {
    if (user) {
      return (
        <>
          <Link
            to="/feed"
            onClick={handleLinkClick}
            className="w-[90%] text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition font-medium py-4 px-6 rounded-lg flex items-center gap-2 mx-auto"
          >
            <ClipboardListIcon className="w-5 h-5" />
            Feed
          </Link>
          <Link
            to="/create"
            onClick={handleLinkClick}
            className="w-[90%] text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition font-medium py-4 px-6 rounded-lg flex items-center gap-2 mx-auto"
          >
            <PencilAltIcon className="w-5 h-5" />
            Create
          </Link>
          <Link
            to="/mypolls"
            onClick={handleLinkClick}
            className="w-[90%] text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition font-medium py-4 px-6 rounded-lg flex items-center gap-2 mx-auto"
          >
            <CollectionIcon className="w-5 h-5" />
            My Polls
          </Link>
          <button
            onClick={handleLogout}
            className="w-[90%] bg-red-100 hover:bg-red-200 text-red-600 font-medium py-4 px-6 rounded-lg transition flex items-center gap-2 mx-auto"
          >
            <LogoutIcon className="w-5 h-5" />
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
            className="w-[90%] text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition font-medium py-4 px-6 rounded-lg flex items-center gap-2 mx-auto"
          >
            <LoginIcon className="w-5 h-5" />
            Login
          </Link>
          <Link
            to="/signup"
            onClick={handleLinkClick}
            className="w-[90%] bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-lg transition font-medium flex items-center gap-2 mx-auto"
          >
            <UserAddIcon className="w-5 h-5" />
            Sign Up
          </Link>
        </>
      );
    }
  };

  return (
    <nav className="w-full bg-transparent backdrop-blur-lg border-b border-indigo-600 py-4 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6">
        <Link
          to="/"
          onClick={handleLinkClick}
          className="text-2xl font-bold text-indigo-600 tracking-tight hover:opacity-90 transition"
        >
          Pollify
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-indigo-600 p-2 rounded-md hover:bg-indigo-100"
          >
            {isOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {renderLinks()}
        </div>
      </div>

      {/* Mobile menu with smooth transition */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        } bg-white bg-opacity-70 backdrop-blur-md rounded-lg`}
      >
        <div className="flex flex-col py-4">{renderLinks()}</div>
      </div>
    </nav>
  );
};

export default Navbar;