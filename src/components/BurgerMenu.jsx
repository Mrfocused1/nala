import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Fun Menu Icon */}
      <button
        onClick={toggleMenu}
        className="relative w-16 h-16 flex items-center justify-center z-[100] pointer-events-auto group"
        onMouseEnter={() => document.body.classList.add('is-hovering')}
        onMouseLeave={() => document.body.classList.remove('is-hovering')}
      >
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 0.9 : 1,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative w-14 h-14"
        >
          {!isOpen ? (
            // Heart Icon
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
              <motion.path
                d="M50,85 C50,85 15,60 15,40 C15,25 25,15 35,15 C42,15 47,20 50,25 C53,20 58,15 65,15 C75,15 85,25 85,40 C85,60 50,85 50,85 Z"
                fill="#c1765b"
                stroke="white"
                strokeWidth="3"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }}
              />
              <motion.circle
                cx="35"
                cy="30"
                r="8"
                fill="white"
                opacity="0.3"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut"
                }}
              />
            </svg>
          ) : (
            // X Close Icon
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
              <circle cx="50" cy="50" r="45" fill="#c1765b" />
              <motion.line
                x1="30" y1="30" x2="70" y2="70"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.line
                x1="70" y1="30" x2="30" y2="70"
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              />
            </svg>
          )}
        </motion.div>
      </button>

      {/* Full Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-[90] flex items-center justify-center pointer-events-auto"
          >
            <nav className="pointer-events-auto">
              <ul className="space-y-8">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="text-center"
                  >
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className="text-6xl md:text-8xl font-black text-white hover:text-white/60 transition-colors pointer-events-auto cursor-pointer block"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Decorative Element */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
              className="absolute bottom-10 right-10"
            >
              <div className="text-white/10 text-7xl md:text-9xl font-black" style={{ fontFamily: 'Playfair Display, serif' }}>
                Nala's <span className="italic font-light">Baby</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BurgerMenu;
