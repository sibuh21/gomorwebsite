"use client";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { motion } from "framer-motion";

const jobOpenings = [
  {
    title: "Senior Architect",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
  },
  {
    title: "Interior Designer",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
  },
  {
    title: "Junior Architect",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
  },
  {
    title: "Project Manager",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
  },
  {
    title: "3D Visualization Specialist",
    location: "Remote",
    type: "Contract",
  },
  {
    title: "Landscape Designer",
    location: "Addis Ababa, Ethiopia",
    type: "Full-time",
  },
];

export default function Career() {
  return (
    <>
      <NavBar />
      <div className="careers-page">
        <div className="careers-hero">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Careers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Gomor Architects has grown since its founding, with projects across
            Ethiopia and beyond. Join our team of passionate designers and
            architects shaping the future of the built environment. We value
            innovation, collaboration, and growth — explore career opportunities
            below.
          </motion.p>
        </div>

        <div className="careers-list">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "2px solid #1a1a1a",
              marginBottom: "0",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#999",
              }}
            >
              Position
            </span>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#999",
              }}
            >
              Location
            </span>
          </div>

          {jobOpenings.map((job, index) => (
            <motion.div
              key={index}
              className="career-item"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <div>
                <p className="career-item-title">{job.title}</p>
                <p className="career-item-location">{job.type}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "13px", color: "#666" }}>
                  {job.location}
                </span>
                <span className="career-item-arrow">→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}