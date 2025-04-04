import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import CreatePoll from "./pages/CreatePoll";
import MyPolls from "./pages/MyPolls";
import VotePoll from "./pages/VotePoll";
import NotFound from "./pages/NotFound";


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/create" element={<CreatePoll />} />
        <Route path="/mypolls" element={<MyPolls />} />
        <Route path="/poll/:id" element={<VotePoll />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;