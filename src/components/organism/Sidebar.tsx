import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Users", path: "/users" },
    { label: "Blog List", path: "/blogs" },
  ];

  const isUsersPage =
    location.pathname === "/users" ||
    location.pathname.startsWith("/add-user") ||
    location.pathname.startsWith("/edit-user");

  return (
    <aside className="sidebar">
      <ul>
        {navItems.map((item) => {
          let isActive = false;

          if (item.path === "/users" && isUsersPage) {
            isActive = true;
          } else if (item.path === "/blogs" && location.pathname.startsWith("/blogs")) {
            isActive = true;
          } else if (item.path === "/" && location.pathname === "/") {
            isActive = true;
          }

          return (
            <li key={item.path}>
              <NavLink to={item.path} className={isActive ? "active" : ""}>
                {item.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
