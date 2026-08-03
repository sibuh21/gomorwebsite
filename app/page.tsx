"use client";
import ListProjects from "@/app/components/listProjects";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Project } from "@prisma/client";
import axios from "axios";

export const TYPOLOGY_VALUES = [
  "Culture",
  "Education",
  "Work",
  "Hospitality",
  "Residential",
  "Infrastructure",
  "Space",
  "Sports",
  "Health",
  "Religion",
  "Exhibition",
] as const;

export type TypologyValue = (typeof TYPOLOGY_VALUES)[number];

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminChecked, setIsAdminChecked] = useState(false);
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const typology = searchParams.get("typology") || "";

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/projects/list", {
          params: {
            category: category || undefined,
            typology: typology || undefined,
          },
        });
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [category, typology]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await axios.get("/api/users/isLoggedIn");
        if (response.data?.user?.role === "ADMIN") {
          setIsAdmin(true);
        }
        setIsAdminChecked(true);
      } catch (error) {
        setIsAdmin(false);
        setIsAdminChecked(true);
      }
    };

    checkAdminStatus();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const normalizedCategory = category?.trim().toUpperCase() || "";
    const normalizedTypology = typology?.trim().toLowerCase() || "";

    const matchesCategory =
      normalizedCategory === "" || normalizedCategory === "ALL"
        ? true
        : project.category?.toString().toUpperCase() === normalizedCategory;

    const matchesTypology =
      !normalizedTypology ||
      project.typology?.toString().trim().toLowerCase() === normalizedTypology;

    return matchesCategory && matchesTypology;
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

  const typologies = TYPOLOGY_VALUES;

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
          {typologies.map((sub) => {
            const isActive = typology.toLowerCase() === sub.toLowerCase();
            return (
              <a
                key={sub}
                href={`/?typology=${sub.toLowerCase()}`}
                className={`cat-btn-sub ${isActive ? "active" : ""}`}
              >
                {sub}
              </a>
            );
          })}
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
          isAdmin={isAdminChecked && isAdmin} 
          onDelete={(id) => setProjects(prev => prev.filter(p => p.id !== id))}
        />
      )}

      <Footer />
    </>
  );
}
