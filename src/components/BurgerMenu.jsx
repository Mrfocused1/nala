import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const BurgerMenu = ({ isOpen, onClose }) => {

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Full Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#c1765b] z-[90] flex items-center justify-center pointer-events-auto overflow-hidden"
          >
            {/* Background Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="https://videos.pexels.com/video-files/6849063/6849063-hd_1920_1080_24fps.mp4" type="video/mp4" />
            </video>

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={onClose}
              className="absolute top-8 right-8 md:top-12 md:right-12 z-20 pointer-events-auto group"
              aria-label="Close menu"
            >
              <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-2xl group-hover:scale-110 transition-transform"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
            </motion.button>

            {/* Menu Content */}
            <nav className="pointer-events-auto relative z-10">
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
                      className="text-5xl md:text-6xl lg:text-7xl font-black text-white hover:text-white/60 transition-colors pointer-events-auto cursor-pointer block drop-shadow-2xl"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Logo at Bottom */}
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.4, type: 'spring', bounce: 0.5 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
            >
              <img
                src="/nala-2.png"
                alt="Nala's Baby Logo"
                className="h-32 md:h-40 w-auto opacity-30"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BurgerMenu;
