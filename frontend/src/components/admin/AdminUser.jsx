    import { useState, useEffect, useContext } from "react";
    import AuthContext from "../../context/AuthContext";
    import api from "../../services/api";
    import Spinner from "../UI/Spinner";
    import Modal from "../UI/Modal";
    import { toast } from "react-toastify";

    function AdminUser() {
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalType, setModalType] = useState("");
    const [filter, setFilter] = useState("all");

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        role: "user",
    });

    // Fetch users from API
    const fetchUsers = async () => {
        setIsLoading(true);
        try {
        const { data } = await api.get("/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(data.data);
        } catch (error) {
        console.error("Failed to fetch users:", error);
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
        const { username, email } = formData;
        if (!username || !email) return "All fields are required.";
        if (!/^\S+@\S+\.\S+$/.test(email)) return "Email must be valid.";
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
            await api.put(`/api/admin/users/${selectedUser._id}`, formData, {
            headers: { Authorization: `Bearer ${token}` },
            });
        } else {
            await api.post(`/api/admin/users`, formData, {
            headers: { Authorization: `Bearer ${token}` },
            });
        }
        closeModal();
        fetchUsers();
        toast.success(
            modalType === "edit" ? "User updated" : "User created successfully"
        );
        } catch (error) {
        if (modalType === "edit") {
            console.error("Failed to update user:", error);
        } else {
            console.error("Failed to create user:", error);
        }
        } finally {
        setIsSubmitting(false);
        }
    };

    const handleSetAdmin = async (userId, isAdmin) => {
        try {
        await api.put(
            `/api/admin/users/${userId}`,
            { role: isAdmin ? "user" : "admin" },
            {
            headers: { Authorization: `Bearer ${token}` },
            }
        );
        toast.success(
            isAdmin
            ? "User's admin access revoked successfully"
            : "User set as admin successfully"
        );
        fetchUsers();
        } catch (error) {
        console.error("Failed to update user role:", error);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        setIsSubmitting(true);
        try {
        await api.delete(`/api/admin/users/${selectedUser._id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setUsers((prev) => prev.filter((user) => user._id !== selectedUser._id));
        toast.success("User deleted successfully");

        closeModal();
        } catch (error) {
        console.error("Failed to delete user:", error);
        } finally {
        setIsSubmitting(false);
        }
    };

    const openModal = (type, user = null) => {
        setModalType(type);
        setSelectedUser(user);
        setFormData(
        user
            ? { username: user.username, email: user.email }
            : { username: "", email: "", role: "user" }
        );
    };

    const closeModal = () => {
        setModalType("");
        setSelectedUser(null);
        setFormData({ username: "", email: "" });
    };

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const filteredUsers =
        filter === "all" ? users : users.filter((user) => user.role === filter);

    return (
        <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Users</h1>
            <span className="text-gray-600 dark:text-gray-400">
            Total Users: {users.length}
            </span>
        </div>

        <div className="mb-4 flex justify-between space-x-4">
            <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded-md dark:bg-gray-800"
            >
            <option value="all">All Users</option>
            <option value="user">Regular Users</option>
            <option value="admin">Admins</option>
            </select>

            <button
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            onClick={() => openModal("create")}
            >
            Add User
            </button>
        </div>
        {isLoading ? (
            <Spinner />
        ) : filteredUsers.length > 0 ? (
            <ul className="space-y-4">
            {filteredUsers.map((user) => (
                <li
                key={user._id}
                className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-md"
                >
                <h3 className="font-bold">{user.username}</h3>
                <p>{user.email}</p>
                <p className="text-sm text-gray-500">
                    Role: {user.role === "admin" ? "Admin" : "User"}
                </p>
                <div className="mt-4 flex space-x-4">
                    <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    onClick={() => openModal("edit", user)}
                    >
                    Edit
                    </button>
                    <button
                    className={`px-4 py-2 rounded-md ${
                        user.role === "admin"
                        ? "bg-gray-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                    onClick={() =>
                        handleSetAdmin(user._id, user.role === "admin")
                    }
                    >
                    {user.role === "admin" ? "Set as User" : "Set as Admin"}
                    </button>
                    <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={() => openModal("delete", user)}
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
                No users found
            </h3>
            </div>
        )}

        {modalType === "edit" && (
            <Modal onClose={closeModal}>
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form className="space-y-4">
                <label className="block">
                Username:
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
                </label>
                <label className="block">
                Email:
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
                </label>
                <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                    {isSubmitting ? <Spinner /> : "Save"}
                </button>
                </div>
            </form>
            </Modal>
        )}

        {modalType === "delete" && selectedUser && (
            <Modal onClose={closeModal}>
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete "{selectedUser.username}"?</p>
            <div className="flex justify-end space-x-4 mt-4">
                <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                Cancel
                </button>
                <button
                onClick={handleDeleteUser}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                Confirm
                </button>
            </div>
            </Modal>
        )}

        {modalType === "create" && (
            <Modal onClose={closeModal}>
            <h2 className="text-xl font-bold mb-4">Add User</h2>
            <form className="space-y-4">
                <label>
                Username:
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
                </label>
                <label>
                Email:
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-md"
                    required
                />
                </label>
                <label>
                Role:
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-md"
                    required
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                </label>
                <button
                type="button"
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                >
                {isSubmitting ? <Spinner /> : "Submit"}
                </button>
            </form>
            </Modal>
        )}
        </div>
    );
    }

    export default AdminUser;
