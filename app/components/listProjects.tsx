"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import CustomAlert from "./CustomAlert";

export type Project = {
  id: number;
  title: string;
  client: string;
  typology: string;
  location: string;
  year: string;
  size: string;
  description: string;
  category: string;
  status: string;
  imagePaths: string[];
  videoPaths: string[];
  createdAt: Date;
  updatedAt: Date;
};

type ListProps = {
  data: Project[];
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
};

/* ── Project Card Component ── */
function ProjectCard({ 
  project, 
  index, 
  isSelected,
  onClick,
  isAdmin = false,
  onDelete,
  onEdit
}: { 
  project: Project; 
  index: number; 
  isSelected: boolean;
  onClick: () => void;
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (id: number) => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  
  useEffect(() => {
    if (isSelected && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const updateScrollMetrics = () => {
        setScrollPosition(container.scrollLeft);
        setMaxScroll(container.scrollWidth - container.clientWidth);
      };
      
      updateScrollMetrics();
      container.addEventListener('scroll', updateScrollMetrics);
      window.addEventListener('resize', updateScrollMetrics);
      
      return () => {
        container.removeEventListener('scroll', updateScrollMetrics);
        window.removeEventListener('resize', updateScrollMetrics);
      };
    }
  }, [isSelected]);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };
  
  const scrollProgress = maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 0;
  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollPosition < maxScroll;
  
  return (
    <motion.div
      className={`project-card ${isSelected ? 'project-card-selected' : ''}`}
      onClick={(e) => {
        // Prevent card click when clicking scroll controls
        if (!(e.target as HTMLElement).closest('.scroll-hint')) {
          onClick();
        }
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.215, 0.610, 0.355, 1.000]
      }}
      whileHover={{ scale: isSelected ? 1 : 1.02 }}
      whileTap={{ scale: isSelected ? 1 : 0.98 }}
    >
      {isAdmin && (
        <div className="admin-actions">
          <button
            type="button"
            className="admin-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(project.id);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(project.id);
            }}
          >
            Delete
          </button>
        </div>
      )}

      {/* Project title and location when not selected */}
      {!isSelected ? (
        <>
          <div className="project-header">
            <h3 className="project-title">{project.title}</h3>
            <p className="project-location">{project.location.toUpperCase()}</p>
          </div>
          
          {/* Project image */}
          {project.imagePaths.length > 0 && (
            <div className="project-image-container">
              <Image
                src={encodeURI(project.imagePaths[0])}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                className="project-image"
              />
            </div>
          )}
        </>
      ) : (
        /* Horizontal scroll expanded view when selected */
        <div className="project-expanded-horizontal" ref={scrollContainerRef}>
          {/* Scroll hint indicators */}
          <button 
            className={`scroll-hint scroll-hint-left ${!canScrollLeft ? 'hidden' : ''}`}
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            ←
          </button>
          
          <button 
            className={`scroll-hint scroll-hint-right ${!canScrollRight ? 'hidden' : ''}`}
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            →
          </button>
          
          {/* Scroll progress indicator */}
          <div className="horizontal-scroll-progress">
            <div 
              className="horizontal-scroll-progress-fill" 
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          
          <div className="horizontal-scroll-content">
            {/* Text content panel with two columns */}
            <div className="horizontal-scroll-item horizontal-text-panel">
              <h2>{project.title}</h2>
              <p className="project-location">{project.location.toUpperCase()}</p>
              
              <div className="horizontal-content-container">
                {/* Metadata column */}
                <div className="horizontal-metadata-column">
                  <div className="horizontal-metadata-grid">
                    <div className="horizontal-metadata-item">
                      <span className="horizontal-metadata-label">Client</span>
                      <span className="horizontal-metadata-value">{project.client}</span>
                    </div>
                    <div className="horizontal-metadata-item">
                      <span className="horizontal-metadata-label">Typology</span>
                      <span className="horizontal-metadata-value">{project.typology}</span>
                    </div>
                    <div className="horizontal-metadata-item">
                      <span className="horizontal-metadata-label">Year</span>
                      <span className="horizontal-metadata-value">{project.year}</span>
                    </div>
                    <div className="horizontal-metadata-item">
                      <span className="horizontal-metadata-label">Size</span>
                      <span className="horizontal-metadata-value">{project.size}</span>
                    </div>
                    <div className="horizontal-metadata-item">
                      <span className="horizontal-metadata-label">Category</span>
                      <span className="horizontal-metadata-value">{project.category}</span>
                    </div>
                    <div className="horizontal-metadata-item">
                      <span className="horizontal-metadata-label">Status</span>
                      <span className="horizontal-metadata-value">{project.status}</span>
                    </div>
                  </div>
                </div>
                
                {/* Description column */}
                <div className="horizontal-description-column">
                  <h3 className="horizontal-description-title">Description</h3>
                  <p className="horizontal-description-text">{project.description}</p>
                </div>
              </div>
            </div>
            
            {/* Image panels */}
            {project.imagePaths.map((imagePath, idx) => (
              <div key={idx} className="horizontal-scroll-item horizontal-media-item">
                <Image
                  src={encodeURI(imagePath)}
                  alt={`${project.title} - Image ${idx + 1}`}
                  fill
                  sizes="100vw"
                  style={{ objectFit: "cover" }}
                  className="horizontal-media-image"
                />
              </div>
            ))}
            
            {/* Video panels */}
            {project.videoPaths.map((videoPath, idx) => (
              <div key={`video-${idx}`} className="horizontal-scroll-item horizontal-media-item">
                <video
                  src={encodeURI(videoPath)}
                  controls
                  className="horizontal-media-video"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}



const ListProjects = ({ data, isAdmin = false, onDelete }: ListProps) => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [deleteAlert, setDeleteAlert] = useState<{
    isOpen: boolean;
    projectId: number | null;
    projectTitle: string;
  }>({ isOpen: false, projectId: null, projectTitle: "" });
  
  const [successAlert, setSuccessAlert] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });

  const handleProjectClick = (project: Project) => {
    // Toggle selection - if clicking the already selected project, deselect it
    setSelectedProjectId(selectedProjectId === project.id ? null : project.id);
  };

  const confirmDelete = async () => {
    const id = deleteAlert.projectId;
    if (id === null) return;
    try {
      await axios.delete(`/api/projects/${id}`);
      onDelete?.(id);
      setDeleteAlert({ isOpen: false, projectId: null, projectTitle: "" });
      setSuccessAlert({
        isOpen: true,
        message: "The project was deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project");
      setDeleteAlert({ isOpen: false, projectId: null, projectTitle: "" });
    }
  };

  const handleDeleteClick = (projectId: number, projectTitle: string) => {
    setDeleteAlert({ isOpen: true, projectId, projectTitle });
  };

  const handleEditClick = (projectId: number) => {
    window.location.href = `/upload?edit=${projectId}`;
  };

  return (
    <div className="projects-page">
      {/* Admin: New Project button */}
      {isAdmin && (
        <div className="admin-toolbar">
          <a href="/upload" className="admin-btn admin-btn-new">
            + New Project
          </a>
        </div>
      )}

      {/* Project List */}
      {data.length === 0 ? (
        <div className="projects-container">
          <div className="empty-state" style={{ padding: "3rem 1rem", textAlign: "center" }}>
            <h2>No projects done in this category</h2>
          </div>
        </div>
      ) : (
        <div className="projects-container">
          {data.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isSelected={selectedProjectId === project.id}
              onClick={() => handleProjectClick(project)}
              isAdmin={isAdmin}
              onDelete={(id) => handleDeleteClick(id, data.find((p) => p.id === id)?.title || "")}
              onEdit={handleEditClick}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Alert Modal */}
      <CustomAlert
        isOpen={deleteAlert.isOpen}
        title="Confirm Deletion"
        message={`Are you sure you want to permanently delete project "${deleteAlert.projectTitle}"?`}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteAlert({ isOpen: false, projectId: null, projectTitle: "" })}
      />

      {/* Success Notification Alert Modal */}
      <CustomAlert
        isOpen={successAlert.isOpen}
        title="Success"
        message={successAlert.message}
        type="info"
        confirmText="OK"
        onClose={() => setSuccessAlert({ isOpen: false, message: "" })}
      />
    </div>
  );
};

export default ListProjects;