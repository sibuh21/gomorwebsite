"use client";
import ListProjects from "@/app/components/listProjects";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Project } from "@prisma/client";
import axios from "axios";

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/projects/list");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkAdminStatus = async () => {
      try {
        const response = await axios.get("/api/users/isLoggedIn");
        if (response.data?.user?.role === "ADMIN") {
          setIsAdmin(true);
        }
      } catch (error) {
        // Not logged in or not admin, ignore
      }
    };

    fetchProjects();
    checkAdminStatus();
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (category === "" || category.toUpperCase() === "ALL") return true;
    return project.category === category;
  });

  // Main category buttons
  const categories = [
    { id: "ALL", label: "All" },
    { id: "ARCHITECTURAL", label: "Architecture" },
    { id: "INTERIOR", label: "Interiors" },
    { id: "LANDSCAPE", label: "Landscape" },
    { id: "PLANNING", label: "Planning" },
    { id: "PRODUCTS", label: "Products" },
  ];

  const subcategories = [
    "Culture", "Education", "Work", "Hospitality", 
    "Residential", "Infrastructure", "Space", "Sports", "Health"
  ];

  return (
    <>
      <NavBar />

      {/* Category Filter Matrix */}
      <div className="category-filter-matrix" style={{ paddingTop: "calc(var(--nav-height) + 40px)" }}>
        <div className="category-row-top">
          {categories.map((cat) => {
            const isActive = category === cat.id || (category === "" && cat.id === "ALL");
            const targetHref = cat.id === "ALL" ? "/" : `/?category=${cat.id}`;
            return (
              <a
                key={cat.id}
                href={targetHref}
                className={`cat-btn-main ${isActive ? "active" : ""}`}
              >
                {cat.label}
              </a>
            );
          })}
        </div>
        
        <div className="category-row-sub">
          {subcategories.map(sub => (
            <a key={sub} href={`/?category=${category}&sub=${sub.toLowerCase()}`} className="cat-btn-sub">
              {sub}
            </a>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="projects-page">
          <div className="project-list">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="project-row-wrapper skeleton" style={{ height: '300px' }} />
            ))}
          </div>
        </div>
      ) : (
        <ListProjects 
          data={filteredProjects} 
          isAdmin={isAdmin} 
          onDelete={(id) => setProjects(prev => prev.filter(p => p.id !== id))}
        />
      )}

      <Footer />
    </>
  );
}
