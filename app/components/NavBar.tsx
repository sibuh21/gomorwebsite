"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./logo";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/architecture", label: "Architecture" },
    { href: "/interior-design", label: "Interior Design" },
  ];

  return (
    <header className="bg-white border-b px-4 py-4 md:px-8 lg:px-12 shadow-sm">
        
        <Logo />

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

     

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white shadow-md rounded-b-lg mt-2"
          >
            <ul className="flex flex-col items-center gap-4 px-4 py-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={classNames(
                    "text-lg flex items-center gap-2",
                    link.href === currentPath
                      ? "text-stone-800 font-semibold"
                      : "text-gray-700 hover:text-red-600"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;