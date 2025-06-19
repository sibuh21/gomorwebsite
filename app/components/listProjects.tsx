"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LoadingThreeDotsJumping from "./LoadTreeDotsJamping";

export interface Project {
  id: string;
  title: string;
  client:string
  typology:string
  location:string
  year:string
  size:string
  description: string;
  category: string;
  status: string;
  imagePaths: string[];
  videoPaths: string[];
  createdAt: Date;
  updatedAt: Date;
}

type ListProps = {
  data: Project[];
  isLoading: boolean;
};

const ListProjects = ({ isLoading, data }: ListProps) => {
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);

  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <div className="relative w-full max-w-screen-xl mx-auto p-4 bg-gray-200">
      {isLoading ? (
        <div className="mt-40 flex justify-center">
          <LoadingThreeDotsJumping />
        </div>
      ) : (
        <div className="space-y-6 py-6 md:pt-10">
          <h2 className="font-extrabold text-2xl md:text-3xl text-center">
            Projects Done
          </h2>

          <ul
             className="flex flex-col items-center gap-8"
          >
            {data.map((project, index) => {
              const isActive = expandedProjects.includes(project.id);

              return (
                <motion.li
                  key={project.id}
                  className="relative bg-white shadow-lg rounded-lg transition-all duration-500 cursor-pointer w-[95vw] sm:w-[85vw] md:w-[50vw] p-8"
                  onClick={() => toggleProject(project.id)}
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: index * 0.1, // Stagger effect for each project
                  }}
                  viewport={{ once: false, amount: 0.2 }} // Ensures animation triggers on scroll
                >
                  

                  {!isActive ? (
                    <div className="flex gap-1">
                      <div className="flex flex-col items-end w-1/4  h-52 md:h-64 m-1 ">
                        <p className="font-bold">{project.title}</p>
                        <p>{project.location}</p>
                      </div>

                      <img
                        className="rounded-md object-cover w-3/4 h-52 md:h-64"
                        src={encodeURI(project.imagePaths[0])}
                        alt="Project Thumbnail"
                        width={700}
                        height={500}
                      />
                    </div>
                  ) : (
                    <div
                      className="flex gap-6 overflow-x-scroll p-2 items-stretch m-2"
                      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                      <style jsx>{`
                        ::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>
                      <div 
                        className="flex-shrink-0 w-30 md:w-50 lg:w-[300px] h-52 md:h-64 lg:h-80 flex flex-col items-end gap-3"
                      >
                        <p className="font-bold">{project.title}</p>
                        <p className="text-gray-400">{project.location}</p>
                        <p>{project.year}</p>
                        <p className="text-gray-400">CLIENT</p>
                        <p>{project.client}</p>
                        <p className="text-gray-400">TYPOLOGY</p>
                        <p>{project.typology}</p>
                        <p className="text-gray-400">SIZE M2/F2</p>
                        <p>{project.size}</p>
                        <p>STATUS</p>
                        <p className="font-semibold text-green-700">{project.status}</p>
                      </div>
                      {/* First Half of Images */}
                      {project.imagePaths.slice(0, Math.ceil(project.imagePaths.length / 2)).map((path, index) => (
                        <div
                          key={`image-${index}`}
                          className="flex-shrink-0 w-72 md:w-96 lg:w-[600px] h-72 md:h-80 lg:h-96 flex flex-col justify-between"
                        >
                          <img
                            className="rounded-md object-cover w-full h-full"
                            src={encodeURI(path)}
                            alt={`Project Image ${index + 1}`}
                            width={700}
                            height={500}
                          />
                        </div>
                      ))}

                      {/* Description Box */}
                      <div className="flex-shrink-0 bg-white p-6 rounded-md min-w-[350px] md:min-w-[400px] max-w-[600px] flex flex-col justify-between h-52 md:h-64 lg:h-80 text-center overflow-hidden">
                        <p className="text-lg text-justify ">
                          {project.description}
                        </p>
                
                      </div>

                      {/* Second Half of Images + Videos */}
                      {project.imagePaths.slice(Math.ceil(project.imagePaths.length / 2)).map((path, index) => (
                        <div
                          key={`image-${index}`}
                          className="flex-shrink-0 w-72 md:w-96 lg:w-[600px] h-72 md:h-80 lg:h-96 flex flex-col justify-between"
                        >
                          <img
                            className="rounded-md object-cover w-full h-full"
                            src={encodeURI(path)}
                            alt={`Project Image ${index + 1}`}
                            width={700}
                            height={500}
                          />
                        </div>
                      ))}

                      {project.videoPaths.map((path, index) => (
                        <div
                          key={`video-${index}`}
                          className="flex-shrink-0 w-72 md:w-96 lg:w-[600px] h-72 md:h-80 lg:h-96 flex flex-col justify-between"
                        >
                          <video className="rounded-md w-full h-full object-cover" src={encodeURI(path)} controls />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.li>
              );
            })}
          </ul>

        </div>
      )}
    </div>
  );
};

export default ListProjects;
