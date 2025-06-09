import { NavLink, useLocation } from "react-router-dom";
import { apply1, apply2, dash1, dash2, logo } from "../constants/assets";
import { useCallback, useEffect, useState } from "react";

type SidebarLink = {
  text: string;
  icon: string;
  activeIcon: string;
  urls: string[];
};

const Sidebar = () => {
  const location = useLocation();
  const [links, setLinks] = useState<SidebarLink[]>([]);

  useEffect(() => {
    const username = localStorage.getItem("oxfusername");

    if (!username) return;

    const newLinks: SidebarLink[] =
      username !== "waeccbtcandidate1"
        ? [
            {
              text: "Test",
              icon: apply1,
              activeIcon: apply2,
              urls: ["/take-test"],
            },
            {
              text: "All Questions",
              icon: apply1,
              activeIcon: apply2,
              urls: ["/questions"],
            },
          ]
        : [
            {
              text: "Admin Panel",
              icon: dash1,
              activeIcon: dash2,
              urls: ["/panel"],
            },
            {
              text: "Scores",
              icon: apply1,
              activeIcon: apply2,
              urls: ["/scores"],
            },
          ];

    setLinks(newLinks);
  }, []);

  const isActive = useCallback(
    (...to: string[]) => {
      return to.some((url) => location.pathname.startsWith(url));
    },
    [location.pathname]
  );

  return (
    <div className="fixed z-40 h-full sidebar font-Montserrat w-1/5 bg-gray-900 text-white">
      <div className="bg-white">
        <img src={logo} alt="logo" className="w-20 h-20 py-2 mx-auto" />
      </div>
      <div className="p-5">
        <ul className="space-y-2">
          {links.map((link) => {
            return (
              <li key={link.text}>
                <NavLink
                  to={link.urls[0]}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition duration-200 ${
                    isActive(...link.urls)
                      ? "bg-white text-gray-900 font-semibold"
                      : "hover:bg-[#dc117b]"
                  }`}
                >
                  <img
                    src={isActive(...link.urls) ? link.activeIcon : link.icon}
                    alt={`${link.text} icon`}
                    className="w-5 h-5"
                  />
                  <span>{link.text}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
