"use client";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { motion } from "framer-motion";

// Sample people data - in production this would come from your API/DB
const leadership = [
  { name: "Founder & Director", role: "Creative Director", initials: "FD" },
  { name: "Partner", role: "Managing Director", initials: "MD" },
  { name: "Partner", role: "Design Director", initials: "DD" },
  { name: "Partner", role: "Technical Director", initials: "TD" },
];

const teamMembers = [
  { name: "Senior Architect", role: "Architecture", initials: "SA" },
  { name: "Project Manager", role: "Management", initials: "PM" },
  { name: "Design Lead", role: "Interior Design", initials: "DL" },
  { name: "Landscape Architect", role: "Landscape", initials: "LA" },
  { name: "Junior Architect", role: "Architecture", initials: "JA" },
  { name: "Structural Engineer", role: "Engineering", initials: "SE" },
  { name: "Urban Planner", role: "Planning", initials: "UP" },
  { name: "Visualization Specialist", role: "3D/Visualization", initials: "VS" },
];

function PersonPlaceholder({ initials }: { initials: string }) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "3/4",
        background: "linear-gradient(135deg, #e8e8e8 0%, #d4d4d4 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
        fontWeight: 700,
        color: "#999",
        letterSpacing: "2px",
      }}
    >
      {initials}
    </div>
  );
}

export default function People() {
  return (
    <>
      <NavBar />
      <div className="people-page">
        {/* Partners / Leadership */}
        <h2 className="people-section-title">Partners</h2>
        <div className="people-grid">
          {leadership.map((person, index) => (
            <motion.div
              key={index}
              className="person-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <PersonPlaceholder initials={person.initials} />
              <p className="person-card-name">{person.name}</p>
              <p className="person-card-role">{person.role}</p>
            </motion.div>
          ))}
        </div>

        {/* Team */}
        <h2 className="people-section-title">Team</h2>
        <div className="people-grid">
          {teamMembers.map((person, index) => (
            <motion.div
              key={index}
              className="person-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
              viewport={{ once: true }}
            >
              <PersonPlaceholder initials={person.initials} />
              <p className="person-card-name">{person.name}</p>
              <p className="person-card-role">{person.role}</p>
            </motion.div>
          ))}
        </div>

        <div style={{ height: "60px" }} />
      </div>
      <Footer />
    </>
  );
}