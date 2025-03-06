import React from "react";
import { Home, Bell,Settings, MessageSquare, Users, Award, Smile } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  const menuItems = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Word Cloud Component", href: "/wordcloud", icon: <Bell size={18} /> },
    { name: "Comment Management", href: "/comments", icon: <MessageSquare size={18} /> },
    { name: "Team Performance", href: "/team", icon: <Users size={18} /> },
    { name: "AI Performance", href: "/performance", icon: <Award size={18} /> },
    { name: "Customer Satisfaction", href: "/satisfaction", icon: <Smile size={18} /> },
    { name: "Settings", href: "/settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-yellow-900 to-yellow-800 text-white p-6 flex flex-col shadow-lg">
      {/* Logo/Header Section */}
      <div className="mb-8 flex items-center space-x-3">
        <div className="w-17 h-11 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-yellow-900 font-extrabold text-2xl">BOC</span>
        </div>
        <h2 className="text-2xl font-bold text-yellow-300 tracking-wide">Dashboard</h2>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="flex items-center px-5 py-3 rounded-lg transition-all duration-300 hover:bg-yellow-700 hover:shadow-md hover:text-yellow-100"
              >
                <span className="mr-3 text-yellow-300">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>


    </div>
  );
};

export default Sidebar;
