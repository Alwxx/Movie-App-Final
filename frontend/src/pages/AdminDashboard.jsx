import { useState } from "react";
import AdminMovie from "../components/admin/AdminMovie";
import AdminUser from "../components/admin/AdminUser";
import AdminComment from "../components/admin/AdminComment";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("movies"); // Tracks the active section

  const renderSection = () => {
    switch (activeSection) {
      case "movies":
        return <AdminMovie />;
      case "users":
        return <AdminUser />;
      case "comments":
        return <AdminComment />;
    }
  };

  return (
    <div className="min-h-screen flex dark:bg-gray-900 bg-gray-200 text-gray-900 dark:text-white">
      <aside className="w-1/4 bg-gray-100 dark:bg-gray-800 p-6 space-y-4">
        <button
          className={`w-full text-left px-4 py-2 rounded-md transition hover:bg-red-200 ${
            activeSection === "movies" ? "bg-red-500 text-white" : ""
          }`}
          onClick={() => setActiveSection("movies")}
        >
          Movies
        </button>
        <button
          className={`w-full text-left px-4 py-2 rounded-md transition hover:bg-red-200 ${
            activeSection === "users" ? "bg-red-500 text-white" : ""
          }`}
          onClick={() => setActiveSection("users")}
        >
          Users
        </button>
        <button
          className={`w-full text-left px-4 py-2 rounded-md transition hover:bg-red-200 ${
            activeSection === "comments" ? "bg-red-500 text-white" : ""
          }`}
          onClick={() => setActiveSection("comments")}
        >
          Comments
        </button>
        <button
          className={`w-full text-left px-4 py-2 rounded-md transition hover:bg-red-200 ${
            activeSection === "ratings" ? "bg-red-500 text-white" : ""
          }`}
          onClick={() => setActiveSection("ratings")}
        >
          Ratings
        </button>
      </aside>

      {/* Right Section */}
      <main className="w-3/4 p-6">{renderSection()}</main>
    </div>
  );
}

export default AdminDashboard;
