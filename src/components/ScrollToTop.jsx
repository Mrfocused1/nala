import React, { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if we've scrolled past the hero section (viewport height)
      const heroHeight = window.innerHeight;
      const scrolled = window.scrollY;

      if (scrolled > heroHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Check initial scroll position
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-8 right-8 z-50
        w-16 h-16 rounded-full
        transition-all duration-300 ease-in-out
        hover:scale-110 active:scale-95
        cursor-pointer
        ${isVisible
          ? 'opacity-100 translate-y-0 animate-bounce-in pointer-events-auto'
          : 'opacity-0 translate-y-8 pointer-events-none'}
      `}
      aria-label="Scroll to top"
    >
      <img
        src="/stickers/stickers.png"
        alt="Scroll to top"
        className="w-full h-full drop-shadow-lg"
      />
    </button>
  );
};

export default ScrollToTop;
