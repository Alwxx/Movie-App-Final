import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import api from "../../services/api";
import Spinner from "../UI/Spinner";
import Modal from "../UI/Modal";

function AdminMovie() {
  const { token } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalType, setModalType] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    release_date: "",
    poster_path: "",
    vote_average: 0,
  });

  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/api/admin/movies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies(data.data);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { title, overview, release_date, poster_path } = formData;

    if (!title || !overview || !release_date || !poster_path) {
      return "All fields are required.";
    }

    if (!/^https?:\/\/.+/.test(poster_path)) {
      return "Poster URL must be valid.";
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalType === "edit") {
        await api.put(`/api/admin/movies/${selectedMovie._id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (modalType === "create") {
        const { data } = await api.post("/api/admin/movies", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMovies((prev) => [...prev, data.data]);
      }
      closeModal();
      fetchMovies();
    } catch (error) {
      console.error(`Failed to ${modalType} movie:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteMovie = async () => {
    if (!selectedMovie) return;

    try {
      await api.delete(`/api/admin/movies/${selectedMovie._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMovies((prev) =>
        prev.filter((movie) => movie._id !== selectedMovie._id)
      );
      closeModal();
    } catch (error) {
      console.error("Failed to delete movie:", error);
    }
  };

  const openModal = (type, movie = null) => {
    setModalType(type);
    setSelectedMovie(movie);
    setFormData(
      type === "edit" && movie
        ? {
            title: movie.title,
            overview: movie.overview,
            release_date: movie.release_date,
            poster_path: movie.poster_path,
            vote_average: movie.vote_average || 0,
          }
        : {
            title: "",
            overview: "",
            release_date: "",
            poster_path: "",
            vote_average: 0,
          }
    );
  };

  const closeModal = () => {
    setModalType("");
    setSelectedMovie(null);
    setFormData({
      title: "",
      overview: "",
      release_date: "",
      poster_path: "",
      vote_average: 0,
    });
  };

  useEffect(() => {
    fetchMovies();
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Movies</h1>
      {movies.length > 0 && (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
          onClick={() => openModal("create")}
        >
          Create New Movie
        </button>
      )}
      {isLoading ? (
        <Spinner />
      ) : movies.length > 0 ? (
        <ul className="space-y-4">
          {movies.map((movie) => (
            <li
              key={movie._id}
              className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-md w-fit"
            >
              {movie.poster_path && (
                <img
                  className="max-w-40 max-h-40 rounded-lg"
                  src={movie.poster_path}
                />
              )}
              <h3 className="font-bold">{movie.title}</h3>
              <p>{movie.overview}</p>
              <p>
                Release Date:{" "}
                {new Date(movie.release_date).toISOString().split("T")[0]}
              </p>
              <div className="mt-4 flex space-x-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={() => openModal("edit", movie)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={() => openModal("delete", movie)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-300">
            No movies found
          </h3>
          <p className="text-gray-400 dark:text-gray-500">
            Get started by creating a new movie!
          </p>
          <button
            onClick={() => openModal("create")}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Create Movie
          </button>
        </div>
      )}

      {(modalType === "edit" || modalType === "create") && (
        <Modal onClose={closeModal}>
          <h2 className="text-xl font-bold mb-4">
            {modalType === "edit" ? "Edit Movie" : "Create Movie"}
          </h2>
          <form className="space-y-4">
            <label className="block">
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </label>
            <label className="block">
              Overview:
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleFormChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </label>
            <label className="block">
              Release Date:
              <input
                type="date"
                name="release_date"
                value={
                  formData.release_date &&
                  new Date(formData.release_date).toISOString().split("T")[0]
                }
                onChange={handleFormChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </label>
            <label className="block">
              Poster URL:
              <input
                type="url"
                name="poster_path"
                value={formData.poster_path}
                onChange={handleFormChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </label>
            <label className="block">
              Vote Average:
              <input
                type="number"
                name="vote_average"
                value={formData.vote_average}
                onChange={handleFormChange}
                className="w-full p-2 border rounded-md"
                min={0}
                max={10}
                step={0.1}
              />
            </label>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                {isSubmitting ? (
                  <Spinner />
                ) : modalType === "edit" ? (
                  "Save"
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modalType === "delete" && selectedMovie && (
        <Modal onClose={closeModal}>
          <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
          <p>Are you sure you want to delete "{selectedMovie.title}"?</p>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteMovie}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AdminMovie;
