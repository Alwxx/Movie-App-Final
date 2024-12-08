import { useContext, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/UI/Spinner";
import AuthContext from "../context/AuthContext";
import api from "../services/api";
import { useHandleError } from "../utils/functions";

export default function ProfilePage() {
  const { user, token, setUser } = useContext(AuthContext); // Load user from AuthContext
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [editingField, setEditingField] = useState(""); // Tracks which field is being edited
  const [isSaving, setIsSaving] = useState(false);
  const [isChanged, setIsChanged] = useState(false); // Tracks if any field has changed

  const handleError = useHandleError();
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = { username, email };
      if (password) payload.password = password;
      const { data } = await api.put("/api/users/profile", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.message) {
        toast[data.success ? "success" : "error"](data.message);
      }

      if (data.data && data.success) {
        setIsChanged(false);
        setEditingField("");
        setUser(data.data);
      }
    } catch (error) {
      handleError(error, "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setIsChanged(true);
    switch (field) {
      case "username":
        setUsername(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-gray-50 dark:bg-gray-800">
      <div className="w-full max-w-lg p-6 bg-white rounded-md shadow-md dark:bg-gray-900">
        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">
          Update Profile
        </h2>
        <div className="mt-6 space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
              Username
            </label>
            {editingField === "username" ? (
              <div className="flex gap-4">
                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    handleFieldChange("username", e.target.value)
                  }
                  className="flex-1 px-3 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                />
                <button
                  onClick={() => setEditingField("")}
                  className="text-sm text-red-500"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-gray-300">
                  {user.username}
                </span>
                <button
                  onClick={() => setEditingField("username")}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
              Email
            </label>
            {editingField === "email" ? (
              <div className="flex gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  className="flex-1 px-3 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                />
                <button
                  onClick={() => setEditingField("")}
                  className="text-sm text-red-500"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-gray-300">
                  {user.email}
                </span>
                <button
                  onClick={() => setEditingField("email")}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
              Password
            </label>
            {editingField === "password" ? (
              <div className="flex gap-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    handleFieldChange("password", e.target.value)
                  }
                  className="flex-1 px-3 py-2 mt-1 text-gray-900 bg-gray-100 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                />
                <button
                  onClick={() => {
                    setPassword("");
                    setEditingField("");
                  }}
                  className="text-sm text-red-500"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-gray-900 dark:text-gray-300">
                  ********
                </span>
                <button
                  onClick={() => setEditingField("password")}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div>
            <button
              onClick={handleSave}
              disabled={!isChanged || isSaving}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSaving ? (
                <Spinner width="w-5" height="h-5" border={`border-2`} />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
