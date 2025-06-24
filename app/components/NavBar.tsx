"use client";

import { useEffect, useState } from "react";
import Logo from "./logo";
import classNames from "classnames";
import AppMenu, { category } from "./menu";

const NavBar = ({setCategory}: {setCategory: (category: string) => void}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [id, setId] = useState<string>("");

  const categories:category[] = [
    { id: "ARCHITECTURAL", label: "Architecture" },
    { id: "INTERIOR", label: "Interior-Design" },
    // { id: "LANDSCAPE", label: "Landscape" },
    // { id: "STRUCTURAL", label: "Structural" },
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
                  "text-lg flex items-center text-gray-700 hover:text-red-600 hover:rounded-md",
                  id === category.id && "border-b-2 border-black rounded-md"
                )}
                onClick={() => {
                  setCategory(category.id)
                  setId(category.id)
                }}
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