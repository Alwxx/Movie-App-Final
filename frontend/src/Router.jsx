import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/navbar/Navbar";
import MovieList from "./components/MovieList/MovieList";
import MovieCard from "./components/moviecard/MovieCard";

function AppRouter() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/movies/:id" element={<MovieCard/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<MovieList />} />

      </Routes>
    </Router>
  );
}

export default AppRouter;
