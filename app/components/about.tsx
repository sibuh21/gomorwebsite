"use client";
import NavBar from "./NavBar";
import Footer from "./Footer";
import Image from "next/image";
import BestHome from "../../public/home.webp";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./location"), { ssr: false });

const disciplines = [
  {
    title: "Architectural Design",
    description:
      "We take on the creation of socially, economically and environmentally perfect places as a practical objective. Our 'pragmatic utopian' designs fuse seemingly incompatible elements — powerplants where you can ski on the roof, flood protection that doubles as playgrounds, parking structures that become mountains of houses with gardens.",
  },
  {
    title: "Interior Design",
    description:
      "Our interior design dissolves the traditional boundaries of space and reassembles them around the human experience. Each project is tailored to its specific needs — from restaurants that put chefs at the heart, to retail spaces that become illuminated urban living rooms for cultural events.",
  },
  {
    title: "Planning",
    description:
      "We take a comprehensive view on the built environment, supporting our teams and clients in thinking in the long-term and across multiple scales and systems. We engage deeply with communities, institutions, and governments to help answer fundamental questions: what, where, why, and for whom should we be building?",
  },
  {
    title: "Products",
    description:
      "Our product design team makes product design a literal extension of our efforts in architecture. Architects rarely have the possibility to specify a building component from scratch, limiting our imagination to what is already on the shelves. Our work in furniture, lighting, and consumer products connects the big picture to the small details.",
  },
];

const offices = [
  { city: "Addis Ababa", country: "Ethiopia", email: "addis@gomor.com", phone: "+251 912 131 415" },
];

export default function About() {
  return (
    <>
      <NavBar />
      <div className="about-page">
        {/* Hero Text Section */}
        <div className="about-hero">
          <p className="about-hero-text">
            The escalating complexity of the world and the accelerating speed of change
            exceed any individual&apos;s capacity to comprehend. As architects and urbanists,
            we must team with scientists, engineers with biologists, politicians with
            entrepreneurs, to combine skill sets and perspectives, knowledge and
            sensibility, to match the complexity of the challenges we face.
          </p>
          <p className="about-hero-text" style={{ marginTop: "24px" }}>
            Gomor has grown organically over the years from a founder, to a family,
            to a force. Our latest transformation combines Landscape, Engineering,
            Architecture, Planning, and Products. A plethora of in-house perspectives
            allows us to see what none of us would be able to see on our own.
          </p>
          <span
            className="about-hero-text signature"
            style={{
              display: "block",
              marginTop: "32px",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "0.5px",
            }}
          >
            Gomor Architects
            <br />
            <span style={{ fontWeight: 400, color: "#999", fontSize: "12px" }}>
              Founder &amp; Creative Director
            </span>
          </span>
        </div>

        {/* Hero Image */}
        <div style={{ width: "100%", height: "60vh", position: "relative", overflow: "hidden" }}>
          <Image
            src={BestHome}
            alt="Gomor Architects featured work"
            fill
            style={{ objectFit: "cover" }}
            sizes="100vw"
            priority
          />
        </div>

        {/* Disciplines */}
        <div className="about-section">
          <div className="about-section-grid">
            <h2 className="about-section-title">What We Do</h2>
            <div>
              {disciplines.map((d) => (
                <div key={d.title} className="about-discipline-card">
                  <h3>{d.title}</h3>
                  <p>{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Offices / Contact */}
        <div className="about-section">
          <div className="about-section-grid">
            <h2 className="about-section-title">Offices</h2>
            <div>
              {offices.map((office) => (
                <div key={office.city} className="about-discipline-card">
                  <h3>
                    {office.city}, {office.country}
                  </h3>
                  <p>
                    {office.phone}
                    <br />
                    <a href={`mailto:${office.email}`} style={{ color: "#666" }}>
                      {office.email}
                    </a>
                  </p>
                </div>
              ))}

              {/* Map */}
              <div style={{ marginTop: "24px" }}>
                <Map />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
