import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import api from "../../services/api";
import Spinner from "../UI/Spinner";
import Modal from "../UI/Modal";
import { toast } from "react-toastify";
import axios from "axios";

const API_KEY = "c56e629d2ce4c5a38303801125569999";
const BASE_URL = "https://api.themoviedb.org/3";

const fetchTmdbMovieDetails = async (tmdbId) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${tmdbId}`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching TMDB movie details for ID ${tmdbId}:`, error);
    return null;
  }
};

function AdminComment() {
  const { token } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [modalType, setModalType] = useState("");
  const [editContent, setEditContent] = useState("");

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/api/admin/comments-with-movies", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch TMDB movie details if required
      const enrichedComments = await Promise.all(
        data.data.map(async (comment) => {
          if (comment.movieDetails.tmdbId) {
            const tmdbDetails = await fetchTmdbMovieDetails(
              comment.movieDetails.tmdbId
            );
            return {
              ...comment,
              movieDetails: {
                title: tmdbDetails?.title || "Unknown Title",
                poster_path: tmdbDetails?.poster_path || "",
              },
            };
          }
          return comment;
        })
      );

      setComments(enrichedComments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditComment = async () => {
    setIsSubmitting(true);
    try {
      await api.put(
        `/api/admin/comments/${selectedComment._id}`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Comment updated successfully");
      fetchComments();
      closeModal();
    } catch (error) {
      console.error("Failed to update comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async () => {
    setIsSubmitting(true);
    try {
      await api.delete(`/api/admin/comments/${selectedComment._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Comment deleted successfully");
      setComments((prev) =>
        prev.filter((comment) => comment._id !== selectedComment._id)
      );
      closeModal();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (type, comment = null) => {
    setModalType(type);
    setSelectedComment(comment);
    if (type === "edit") {
      setEditContent(comment.content);
    }
  };

  const closeModal = () => {
    setModalType("");
    setSelectedComment(null);
    setEditContent("");
  };

  useEffect(() => {
    fetchComments();
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Comments</h1>
      {isLoading ? (
        <Spinner />
      ) : (
        <ul className="space-y-6">
          {comments.map((comment) => (
            <li
              key={comment._id}
              className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-md flex space-x-4"
            >
              <img
                src={
                  comment.movieDetails.poster_path
                    ? `https://image.tmdb.org/t/p/w200${comment.movieDetails.poster_path}`
                    : "/placeholder.jpg"
                }
                alt={comment.movieDetails.title}
                className="w-20 h-28 rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-bold">{comment.movieDetails.title}</h3>
                <p className="text-sm text-gray-500">
                  Commented by:{" "}
                  {comment.user
                    ? `${comment.user.username} (${comment.user.email})`
                    : "User Deleted"}
                </p>
                <p className="mt-2">{comment.content}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={() => openModal("edit", comment)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={() => openModal("delete", comment)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalType === "edit" && selectedComment && (
        <Modal onClose={closeModal}>
          <h2 className="text-xl font-bold mb-4">Edit Comment</h2>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <div className="flex justify-end mt-4 space-x-4">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
              onClick={closeModal}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={handleEditComment}
            >
              {isSubmitting ? <Spinner /> : "Save"}
            </button>
          </div>
        </Modal>
      )}

      {modalType === "delete" && selectedComment && (
        <Modal onClose={closeModal}>
          <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
          <p>Are you sure you want to delete this comment?</p>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteComment}
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

export default AdminComment;
