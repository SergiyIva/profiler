import React from "react";
import { FaUser, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const data = [
  {
    title: "Все профили",
    to: "/people",
    icon: <FaUsers />,
  },
  {
    title: "Мой профиль",
    to: "/account",
    icon: <FaUser />,
  },
];
export default function Navigation() {
  return (
    <nav>
      <ul className={"nav-list"}>
        {data.map(({ title, icon, to }) => (
          <li key={to}>
            <Link className={"flex-gap"} to={to}>
              {icon}
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
