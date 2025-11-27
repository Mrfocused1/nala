import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const BurgerMenu = ({ isOpen, onClose }) => {

  const menuItems = [
    { name: 'Home', path: '/' },
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
