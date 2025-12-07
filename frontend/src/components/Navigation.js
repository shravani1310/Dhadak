import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'workshop', label: 'Workshop' },
    { id: 'team', label: 'Team' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <div className="bg-black/50 backdrop-blur-lg border border-white/10 rounded-full px-8 py-4">
          <div className="flex items-center gap-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-xl font-heading font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              DHADAK
            </button>
            {navItems.slice(1).map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-foreground hover:text-primary transition-colors duration-300 text-sm font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="fixed top-4 right-4 z-50 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-black/50 backdrop-blur-lg border border-white/10 rounded-full p-4"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 w-64 h-full bg-black/95 backdrop-blur-lg border-l border-white/10 z-40 md:hidden"
          >
            <div className="flex flex-col items-start gap-6 p-8 mt-20">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-foreground hover:text-primary transition-colors duration-300 text-lg font-medium"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
