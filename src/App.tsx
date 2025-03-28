import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Terminal, Blocks, Send, Github, Linkedin, ExternalLink, ArrowRight, Circle, Gamepad2, Network } from 'lucide-react';
import { Terminal as TerminalComponent } from './components/Terminal';

// Animation variants for page transitions
const pageVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0,
    scale: 0.9
  }),
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.5,
      duration: 0.3
    }
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -500 : 500,
    opacity: 0,
    scale: 0.9,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      mass: 0.5,
      duration: 0.3
    }
  })
};

function TypewriterText({ text, delay = 50 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    setDisplayText(''); // Reset text when input changes
    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, delay);
    
    return () => clearInterval(timer);
  }, [text, delay]);

  return <span>{displayText}</span>;
}

function CyclingTypewriter({ texts, delay = 2000 }: { texts: string[]; delay?: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isDeleting) {
      if (displayText === '') {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      } else {
        timeout = setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1));
        }, 50);
      }
    } else {
      const currentText = texts[currentIndex];
      if (displayText === currentText) {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, delay);
      } else {
        const typingDelay = Math.random() * 100 + 100;
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, typingDelay);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, currentIndex, isDeleting, texts, delay]);

  return (
    <span className="text-zinc-400">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [direction, setDirection] = useState(0);

  const sections = ['about', 'projects', 'contact'];

  const handleSectionChange = (newSection: string) => {
    const currentIndex = sections.indexOf(activeSection);
    const newIndex = sections.indexOf(newSection);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setActiveSection(newSection);
  };

  const skills = [
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript",
    "C#",
    "Python",
    "Vite"
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIntroVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to send message');

      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });

      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    } catch (error) {
      setFormStatus('error');
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    }
  };

  const projects = [
    {
      title: "Project-B",
      description: "A console based C# restaurant reservation system",
      icon: <Terminal className="w-20 h-20 text-zinc-400" />,
      tech: ["C#", ".NET", "Console", "SQLite"],
      link: "https://github.com/Zjoswaa/Project-B"
    },
    {
      title: "Project-Alpha",
      description: "A console based C# text adventure game",
      icon: <Gamepad2 className="w-20 h-20 text-zinc-400" />,
      tech: ["C#", ".NET", "Console", "Game Development"],
      link: "https://github.com/Zjoswaa/Project-Alpha"
    },
    {
      title: "UDPClient",
      description: "A UDP client and server implementation in C#",
      icon: <Network className="w-20 h-20 text-zinc-400" />,
      tech: ["C#", ".NET", "UDP", "Networking"],
      link: "https://github.com/TomvGenderen/UDPClient"
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 relative overflow-hidden">
      <AnimatePresence>
        {isIntroVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-zinc-900 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold"
            >
              <TypewriterText text="Welcome to my portfolio." delay={30} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`,
        }}
      />

      <header className="fixed top-0 left-0 right-0 h-20 bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800 z-40">
        <div className="container mx-auto h-full flex items-center justify-between px-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => handleSectionChange('about')}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <Terminal className="w-8 h-8" />
            <span className="text-xl font-semibold tracking-tight">Tom.dev</span>
          </motion.button>

          <nav className="flex items-center space-x-8">
            {[
              { id: 'about', label: 'About', icon: Code2 },
              { id: 'projects', label: 'Projects', icon: Blocks },
              { id: 'contact', label: 'Contact', icon: Send }
            ].map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={() => handleSectionChange(id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  activeSection === id 
                    ? 'bg-zinc-800 text-white' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span className="text-sm font-medium">{label}</span>
              </motion.button>
            ))}
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          {activeSection === 'about' && (
            <motion.div
              key="about"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="container mx-auto"
            >
              <div className="max-w-4xl mx-auto">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mb-12"
                >
                  <h1 className="text-7xl font-bold mb-4 tracking-tight">
                    Tom van Genderen
                    <br />
                    <span className="text-zinc-500 text-4xl font-normal">Computer Science Student</span>
                  </h1>
                  <div className="text-xl leading-relaxed max-w-2xl space-y-4">
                    <p>
                      I'm passionate about creating innovative solutions and learning new technologies.
                    </p>
                    <p className="flex items-center space-x-2">
                      <span>Experience with</span>
                      <CyclingTypewriter texts={skills} delay={1500} />
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
                >
                  <div className="space-y-6">
                    <div className="flex space-x-4">
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="https://github.com/TomvGenderen"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full"
                      >
                        <Github size={18} />
                        <span className="text-sm">GitHub</span>
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="https://www.linkedin.com/in/tom-van-genderen-4a2076235/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full"
                      >
                        <Linkedin size={18} />
                        <span className="text-sm">LinkedIn</span>
                      </motion.a>
                    </div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-zinc-800/50 backdrop-blur rounded-2xl p-8 border border-zinc-700/50"
                  >
                    <h3 className="text-xl font-semibold mb-6">Technical Expertise</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {skills.map((skill) => (
                        <motion.div 
                          key={skill} 
                          className="flex items-center space-x-2"
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Circle size={6} className="text-zinc-500" />
                          <span className="text-zinc-300">{skill}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-zinc-800/50 backdrop-blur rounded-2xl p-8 border border-zinc-700/50"
                  >
                    <h3 className="text-xl font-semibold mb-6">Education</h3>
                    <div className="space-y-4">
                      <motion.div 
                        className="space-y-2"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="flex items-center space-x-2">
                          <ArrowRight size={16} className="text-zinc-500" />
                          <span className="font-medium">Computer Science</span>
                        </div>
                        <p className="text-sm text-zinc-400 pl-6">Currently Studying</p>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'projects' && (
            <motion.div
              key="projects"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="container mx-auto"
            >
              <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold mb-12">Selected Work</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -10 }}
                      className="group relative bg-zinc-800/50 backdrop-blur rounded-2xl p-8 border border-zinc-700/50"
                    >
                      <div className="flex flex-col items-center">
                        <div className="mb-6 transform group-hover:scale-110 transition-transform">
                          {project.icon}
                        </div>
                        <h3 className="text-2xl font-semibold mb-2 text-center">{project.title}</h3>
                        <p className="text-zinc-300 mb-4 text-center">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4 justify-center">
                          {project.tech.map((tech) => (
                            <span 
                              key={tech} 
                              className="px-3 py-1 bg-zinc-700/80 backdrop-blur-sm rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <motion.a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ x: 5 }}
                          className="flex items-center space-x-2 text-zinc-300 hover:text-white transition-colors mt-auto"
                        >
                          <span>View on GitHub</span>
                          <Github size={16} />
                        </motion.a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'contact' && (
            <motion.div
              key="contact"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="container mx-auto"
            >
              <div className="max-w-2xl mx-auto">
                <h2 className="text-4xl font-bold mb-8">Get in Touch</h2>
                <div className="bg-zinc-800/50 backdrop-blur rounded-2xl p-8 border border-zinc-700/50">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">Message</label>
                      <textarea
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500"
                      ></textarea>
                    </div>
                    <motion.button
                      type="submit"
                      disabled={formStatus === 'sending'}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 rounded-lg font-medium transition-colors ${
                        formStatus === 'sending'
                          ? 'bg-zinc-600 cursor-not-allowed'
                          : 'bg-zinc-700 hover:bg-zinc-600'
                      }`}
                    >
                      {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                    </motion.button>
                    {formStatus === 'success' && (
                      <p className="text-green-500 text-center">Message sent successfully!</p>
                    )}
                    {formStatus === 'error' && (
                      <p className="text-red-500 text-center">Failed to send message. Please try again.</p>
                    )}
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <TerminalComponent />
    </div>
  );
}

export default App;