import React from "react";
import { motion } from "framer-motion";
import { Github, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

interface ProjectDetailProps {
  projects: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    tech: string[];
    link: string;
    detailedDescription: string;
    features: string[];
    images: string[];
  }[];
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
  },
};

export function ProjectDetail({ projects }: ProjectDetailProps) {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.id === projectId);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/projects", { replace: true });
  };

  if (!project) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="min-h-screen bg-zinc-900 text-white pt-32 pb-20 px-6"
      >
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8">Project not found</h1>
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Projects</span>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen bg-zinc-900 text-white pt-32 pb-20 px-6"
    >
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Projects</span>
          </button>

          <div className="bg-zinc-800/50 backdrop-blur rounded-2xl p-8 border border-zinc-700/50">
            <div className="flex items-center space-x-4 mb-8">
              <div className="transform scale-150">{project.icon}</div>
              <h1 className="text-4xl font-bold">{project.title}</h1>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                <p className="text-zinc-300 leading-relaxed">
                  {project.detailedDescription}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                <ul className="space-y-2">
                  {project.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center space-x-2 text-zinc-300"
                    >
                      <span className="text-zinc-500">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Technologies Used
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-zinc-700/80 backdrop-blur-sm rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {project.images.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.images.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative aspect-video rounded-lg overflow-hidden"
                      >
                        <img
                          src={image}
                          alt={`${project.title} screenshot ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-8">
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center space-x-2 bg-zinc-700 hover:bg-zinc-600 px-6 py-3 rounded-lg transition-colors"
                >
                  <Github size={20} />
                  <span>View on GitHub</span>
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
