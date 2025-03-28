import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X, Shield } from 'lucide-react';

interface Command {
  input: string;
  output: string | JSX.Element;
  timestamp: number;
}

interface HackingGame {
  isActive: boolean;
  sequence: string[];
  userSequence: string[];
  level: number;
  attempts: number;
  hint?: string;
}

const COMMANDS = {
  help: 'Available commands:\n  help - Show this help message\n  about - Learn about me\n  skills - List my technical skills\n  clear - Clear the terminal\n  projects - View my projects\n  contact - Get my contact info\n  hack - Start the hacking mini-game\n  exit - Close the terminal',
  about: "Hi! I'm Tom, a Computer Science student passionate about creating innovative solutions. I love exploring new technologies and building things that make a difference.",
  skills: "Technical Skills:\n- Next.js\n- React\n- TypeScript\n- JavaScript\n- C#\n- Python\n- Vite",
  projects: "Recent Projects:\n1. Project-B - Restaurant reservation system\n2. Project-Alpha - Text adventure game\n3. UDPClient - Network implementation",
  contact: "Email: Tom.vangenderen@gmail.com\nGitHub: https://github.com/TomvGenderen\nLinkedIn: https://www.linkedin.com/in/tom-van-genderen-4a2076235/",
  clear: '',
  exit: '',
  hack: '',
};

const LEVELS = [
  {
    sequence: ['RED', 'BLUE', 'GREEN'],
    type: 'sequence',
    description: 'Enter each code separately in the correct order.',
  },
  {
    sequence: ['PYTHON'],
    type: 'word',
    hint: 'I am a snake, and also a programming language. What am I?',
    description: 'Solve the riddle to find the password.',
  },
  {
    sequence: ['42'],
    type: 'math',
    hint: 'Calculate: (8 * 6) - 6',
    description: 'Solve the equation to proceed.',
  },
];

export function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([]);
  const [game, setGame] = useState<HackingGame>({
    isActive: false,
    sequence: [],
    userSequence: [],
    level: 0,
    attempts: 3,
  });
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const startHackingGame = () => {
    setGame({
      isActive: true,
      sequence: LEVELS[0].sequence,
      userSequence: [],
      level: 0,
      attempts: 3,
    });
    return (
      <div className="space-y-2 text-green-400">
        <p>🔒 SECURITY BREACH INITIATED...</p>
        <p>Level 1: {LEVELS[0].description}</p>
        <p className="font-mono">Sequence: {LEVELS[0].sequence.join(' > ')}</p>
        <p className="text-yellow-400">IMPORTANT: Enter one code at a time!</p>
        <p>Example: First type "RED", then "BLUE", then "GREEN"</p>
        <p className="text-xs mt-2">Attempts remaining: {game.attempts}</p>
        <p className="text-xs">Next required code: {LEVELS[0].sequence[0]}</p>
      </div>
    );
  };

  const handleHackingInput = (input: string) => {
    const currentLevel = LEVELS[game.level];
    const userCode = input.toUpperCase();
    
    if (currentLevel.type === 'sequence') {
      const expectedCode = currentLevel.sequence[game.userSequence.length];
      if (userCode === expectedCode) {
        const newUserSequence = [...game.userSequence, userCode];
        if (newUserSequence.length === currentLevel.sequence.length) {
          return handleLevelComplete();
        }
        setGame({ ...game, userSequence: newUserSequence });
        const nextCode = currentLevel.sequence[newUserSequence.length];
        return (
          <div className="space-y-2 text-green-400">
            <p>✅ Code accepted!</p>
            <p className="font-mono">Full sequence: {currentLevel.sequence.join(' > ')}</p>
            <p className="text-yellow-400">Next required code: {nextCode}</p>
            <p className="text-xs">Progress: {newUserSequence.length}/{currentLevel.sequence.length} codes entered</p>
          </div>
        );
      }
    } else {
      // Word guessing and math puzzles
      if (userCode === currentLevel.sequence[0]) {
        return handleLevelComplete();
      }
    }

    // Handle incorrect input
    const newAttempts = game.attempts - 1;
    if (newAttempts === 0) {
      setGame({ ...game, isActive: false });
      return (
        <div className="space-y-2 text-red-400">
          <p>❌ SECURITY SYSTEM LOCKED!</p>
          <p>Too many failed attempts. Type 'hack' to try again.</p>
        </div>
      );
    }
    
    setGame({ ...game, attempts: newAttempts });
    return (
      <div className="space-y-2 text-yellow-400">
        <p>❌ Incorrect! Try again.</p>
        <p className="text-xs">Attempts remaining: {newAttempts}</p>
        {currentLevel.hint && (
          <p className="text-cyan-400">Hint: {currentLevel.hint}</p>
        )}
      </div>
    );
  };

  const handleLevelComplete = () => {
    if (game.level === LEVELS.length - 1) {
      setGame({ ...game, isActive: false });
      return (
        <div className="space-y-2 text-green-400">
          <p>🎉 SYSTEM SUCCESSFULLY HACKED! 🎉</p>
          <p>All security protocols bypassed.</p>
          <p className="text-xs">Achievement unlocked: Master Hacker</p>
        </div>
      );
    }
    
    const nextLevel = game.level + 1;
    const nextLevelData = LEVELS[nextLevel];
    setGame({
      ...game,
      level: nextLevel,
      userSequence: [],
      sequence: nextLevelData.sequence,
    });

    return (
      <div className="space-y-2 text-green-400">
        <p>✨ LEVEL {game.level + 1} COMPLETE!</p>
        <p>Level {nextLevel + 1}: {nextLevelData.description}</p>
        {nextLevelData.hint && (
          <p className="text-cyan-400">Hint: {nextLevelData.hint}</p>
        )}
      </div>
    );
  };

  const handleCommand = (cmd: string) => {
    const normalizedCmd = cmd.toLowerCase().trim();
    
    if (normalizedCmd === 'clear') {
      setHistory([]);
      return;
    }

    if (normalizedCmd === 'exit') {
      setIsOpen(false);
      return;
    }

    if (game.isActive) {
      const output = handleHackingInput(cmd);
      setHistory(prev => [...prev, { input: cmd, output, timestamp: Date.now() }]);
      return;
    }

    if (normalizedCmd === 'hack') {
      const output = startHackingGame();
      setHistory(prev => [...prev, { input: cmd, output, timestamp: Date.now() }]);
      return;
    }

    const output = COMMANDS[normalizedCmd as keyof typeof COMMANDS] || `Command not found: ${cmd}. Type 'help' for available commands.`;
    
    setHistory(prev => [...prev, {
      input: cmd,
      output,
      timestamp: Date.now()
    }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    handleCommand(input);
    setInput('');
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-zinc-800 text-zinc-100 p-3 rounded-full shadow-lg hover:bg-zinc-700 transition-colors"
      >
        <TerminalIcon size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-4 md:inset-auto md:right-6 md:bottom-20 md:w-[32rem] md:h-[24rem] bg-zinc-900/95 backdrop-blur border border-zinc-700/50 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-700/50">
              <div className="flex items-center space-x-2">
                <Shield size={16} className={game.isActive ? "text-green-400" : "text-zinc-400"} />
                <h3 className="text-sm font-medium text-zinc-100">Terminal {game.isActive && "- HACKING IN PROGRESS"}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div
              ref={terminalRef}
              className="p-4 h-[calc(100%-8rem)] overflow-y-auto font-mono text-sm"
            >
              <div className="text-green-400 mb-4">
                Welcome to Tom's interactive terminal! Type 'help' for available commands.
              </div>
              
              {history.map((cmd, i) => (
                <div key={cmd.timestamp + i} className="mb-4">
                  <div className="flex items-center text-zinc-400">
                    <span className="text-green-400">➜</span>
                    <span className="ml-2">{cmd.input}</span>
                  </div>
                  <div className="mt-1 text-zinc-100 whitespace-pre-wrap">{cmd.output}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t border-zinc-700/50">
              <div className="flex items-center">
                <span className="text-green-400 mr-2">➜</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-zinc-100 font-mono text-sm"
                  placeholder="Type a command..."
                  spellCheck={false}
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}