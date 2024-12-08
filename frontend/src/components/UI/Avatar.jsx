import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import Dropdown from "./Dropdown";

function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    color += ("00" + ((hash >> (i * 8)) & 0xff).toString(16)).slice(-2);
  }
  return color;
}

function getInitials(email) {
  const parts = email
    .split("@")[0]
    .split(/[.\-_]/)
    .filter(Boolean);
  if (parts.length > 1) {
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  }
  return email.charAt(0).toUpperCase();
}

const Avatar = ({ customUser = null, showDropdown = true, size = 40 }) => {
  const { user, isLoading, setToken, setUser } = useContext(AuthContext);
  let username;
  if (customUser) {
    username = customUser.username;
  } else {
    username = user.username;
  }

  const backgroundColor = stringToColor(username);
  const initials = getInitials(username);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("jwt");
  };

  const links = [
    {
      url: "/profile",
      label: "Account Settings",
    },
    {
      url: "",
      label: "Sign Out",
      callback: handleLogout,
    },
  ];

  return (
    <div className="flex gap-2 items-center">
      <div
        style={{
          backgroundColor,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: "bold",
          fontSize: `${size / 2.5}px`,
          textTransform: "uppercase",
        }}
        title={username}
      >
        {initials}
      </div>
      {showDropdown && <Dropdown label={username} links={links} />}
    </div>
  );
};

export default Avatar;
