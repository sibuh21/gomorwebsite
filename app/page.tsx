"use client"
import ListProjects from "@/app/components/listProjects";
import NavBar from "@/app/components/NavBar";
import { useEffect, useState } from "react";
import { Project } from "@prisma/client";
import axios from "axios";
export default function App() {
  const [category, setCategory] = useState<string>("")
  const [projects, setProjects] = useState<Project[]>([])
    useEffect(() => {
      const fetchProjects = async () => {
        try {
          const response = await axios.get('/api/projects/list');
          setProjects(response.data);
        } catch (error) {
          console.error("Error fetching projects:", error);
        }
      };
      fetchProjects();
    }, []);
  const filteredProjects = projects.filter((project) => {
    if (category === "") return true;
    return project.category === category
  });
  
  return (
    <>  
    <NavBar setCategory={setCategory}/>
    <ListProjects data={filteredProjects} />
    </>
  );
}
