"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./logo";
import classNames from "classnames";
import { usePathname } from "next/navigation";
import AppMenu from "./menu";
import { category } from "./menu";

const NavBar = ({setCategory}: {setCategory: (category: string) => void}) => {
  const currentPath = usePathname();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const categories:category[] = [
    { id: "ARCHITECTURAL", label: "Architecture" },
    { id: "INTERIOR", label: "Interior-Design" },
    { id: "LANDSCAPE", label: "Landscape" },
    { id: "STRUCTURAL", label: "Structural" },
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768)
    }
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  return (
    <header className={`flex items-center ${isSmallScreen ? "justify-between" : "space-x-32"} bg-white border-b px-4 py-4 md:px-8 lg:px-12 shadow-sm`}>
        <Logo />
       
      {isSmallScreen? (
          <AppMenu categories={categories} setCategory={setCategory}/>
          
      ) : (
          <ul className="flex items-center gap-5">
            {categories.map((category) => (
              <li
                key={category.id}
                className={classNames(
                  "text-lg flex items-center",
                  category.id === currentPath
                    ? "text-stone-800 font-semibold"
                    : "text-gray-700 hover:text-red-600"
                )}
                onClick={() => setCategory(category.id)}
              >
                { category.label}
              </li>
            ))}
          </ul>
      )}
    </header>
  );
};

export default NavBar;