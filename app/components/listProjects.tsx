"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

/* ── small icon placeholder (resembles the BIG.dk project icons) ── */
function ProjectIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      style={{ margin: "0 auto 8px" }}
    >
      <rect
        x="4"
        y="4"
        width="32"
        height="32"
        rx="4"
        stroke="#1a1a1a"
        strokeWidth="2"
        fill="none"
      />
      <rect x="12" y="12" width="16" height="16" rx="2" fill="#1a1a1a" />
    </svg>
  );
}

/* ── Expanded horizontal scroll strip ── */
function ExpandedProject({ project }: { project: Project }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  /* auto-scroll hint: nudge right briefly */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ left: 0, behavior: "instant" });
    }
  }, []);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "70vh", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{ overflow: "hidden", width: "100%" }}
    >
      <div
        ref={scrollRef}
        className="expanded-scroll-strip"
      >
        {/* First image (large) */}
        {project.imagePaths.length > 0 && (
          <div className="expanded-image-panel">
            <Image
              src={encodeURI(project.imagePaths[0])}
              alt={project.title}
              fill
              sizes="60vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {/* Description panel */}
        <div className="expanded-description-panel">
          <p className="expanded-description-text">{project.description}</p>
        </div>

        {/* Remaining images */}
        {project.imagePaths.slice(1).map((path, index) => (
          <div key={`img-${index}`} className="expanded-image-panel">
            <Image
              src={encodeURI(path)}
              alt={`${project.title} ${index + 2}`}
              fill
              sizes="60vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}

        {/* Videos */}
        {project.videoPaths.map((path, index) => (
          <div key={`vid-${index}`} className="expanded-image-panel">
            <video
              src={encodeURI(path)}
              controls
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const ListProjects = ({ data, isAdmin = false, onDelete }: ListProps) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteAlert, setDeleteAlert] = useState<{
    isOpen: boolean;
    projectId: number | null;
    projectTitle: string;
  }>({ isOpen: false, projectId: null, projectTitle: "" });
  
  const [successAlert, setSuccessAlert] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });

  const router = useRouter();

  const handleToggle = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const initiateDelete = (e: React.MouseEvent, id: number, title: string) => {
    e.stopPropagation();
    setDeleteAlert({
      isOpen: true,
      projectId: id,
      projectTitle: title,
    });
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

  const handleEdit = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    router.push(`/upload?edit=${id}`);
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

      <div className="project-list">
        {data.map((project, index) => {
          const isExpanded = expandedId === project.id;

          return (
            <div key={project.id} className="project-row-wrapper">
              {/* Project Row */}
              <motion.div
                className={`project-row ${isExpanded ? "expanded" : ""}`}
                onClick={() => handleToggle(project.id)}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: index < 5 ? index * 0.1 : 0,
                }}
                viewport={{ once: false, amount: 0.15 }}
              >
                {/* Left side: icon + title + location */}
                <div className="project-info-col">
                  <ProjectIcon />
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-location">
                    {project.location.toUpperCase()}
                  </p>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="project-extra-details"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      >
                        <p><strong>Year</strong> {project.year}</p>
                        <p><strong>Client</strong> {project.client}</p>
                        <p><strong>Typology</strong> {project.typology}</p>
                        <p><strong>Size</strong> {project.size}</p>
                        <p><strong>Status</strong> {project.status}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right side: project image OR expanded scroll strip */}
                <div className="project-content-col">
                  <AnimatePresence mode="wait">
                    {!isExpanded ? (
                      <motion.div
                        key="image"
                        className="project-image-col"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {project.imagePaths.length > 0 && (
                          <Image
                            src={encodeURI(project.imagePaths[0])}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 60vw"
                            style={{ objectFit: "cover" }}
                          />
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="expanded"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <ExpandedProject project={project} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Admin action buttons placed to the right (overlay style inside row wrapper) */}
              {isAdmin && (
                <div className="admin-actions">
                  <button
                    className="admin-btn admin-btn-edit"
                    onClick={(e) => handleEdit(e, project.id)}
                    title="Edit project"
                  >
                    ✎ Edit
                  </button>
                  <button
                    className="admin-btn admin-btn-delete"
                    onClick={(e) => initiateDelete(e, project.id, project.title)}
                    title="Delete project"
                  >
                    ✕ Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

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
