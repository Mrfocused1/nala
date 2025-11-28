import React, { useEffect, useRef, useState } from 'react';
import { FaHandPointUp } from 'react-icons/fa6';
import BurgerMenu from './BurgerMenu';

const HeroSection = () => {
  const videoRef = useRef(null);
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const feedbackContainerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Custom cursor tracking
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const spawnIcon = (x, y, isMuted) => {
    const el = document.createElement('div');
    el.className = 'absolute text-4xl text-white font-bold drop-shadow-md animate-pop-out flex items-center justify-center';
    el.style.left = x + 'px';
    el.style.top = y + 'px';

    const iconHTML = isMuted
      ? '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" class="w-12 h-12" xmlns="http://www.w3.org/2000/svg"><path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"></path></svg>'
      : '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 640 512" class="w-12 h-12" xmlns="http://www.w3.org/2000/svg"><path d="M533.6 32.5C598.5 85.3 640 165.8 640 256s-41.5 170.8-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"></path></svg>';

    el.innerHTML = `
      <div class="bg-black/50 p-4 rounded-full backdrop-blur-sm">
        ${iconHTML}
      </div>
    `;

    feedbackContainerRef.current.appendChild(el);

    setTimeout(() => {
      el.remove();
    }, 800);
  };

  const handleClick = (e) => {
    // Don't toggle video sound if clicking interactive elements
    if (e.target.closest('.pointer-events-auto')) {
      return;
    }

    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      spawnIcon(e.clientX, e.clientY, videoRef.current.muted);
    }
  };

  return (
    <div className="relative h-screen w-screen bg-[#ffeddb] text-white overflow-hidden hero-cursor-hidden" onClick={handleClick}>
      {/* Background Video */}
      <div className="hero-video-container">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="https://videos.pexels.com/video-files/6849063/6849063-hd_1920_1080_24fps.mp4" type="video/mp4" />
        </video>
        <div className="overlay absolute inset-0 pointer-events-none"></div>
      </div>

      {/* Header / Nav */}
      <header className="fixed top-0 left-0 w-full z-40 pointer-events-none">
        {/* Center: Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[20px] pointer-events-auto">
          <img
            src="/nala-2.png"
            alt="Nala's Baby Logo"
            className="h-16 md:h-20 w-auto drop-shadow-lg hover:scale-105 transition-transform cursor-pointer"
          />
        </div>

        {/* Right: Menu Button */}
        <div className="absolute right-[50px] top-[24px] pointer-events-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="group transition-transform hover:translate-x-1"
          >
            <span className="relative inline-block">
              <span
                className="text-xl md:text-2xl italic font-light tracking-wide transition-colors text-[#c1765b] hover:text-white"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  textShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                menu
              </span>
              <svg
                className="absolute -top-[50%] -left-[25%] w-[150%] h-[200%] overflow-visible cursor-pointer"
                viewBox="0 0 200 100"
              >
                <path
                  d="M 20 40 C 20 20, 80 10, 150 20 C 200 30, 190 80, 140 85 C 90 90, 30 80, 25 50"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="opacity-80"
                />
              </svg>
            </span>
          </button>
        </div>
      </header>

      {/* Burger Menu */}
      <BurgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Hero Content */}
      <main className="absolute inset-x-0 bottom-[200px] md:bottom-[220px] flex justify-center z-10 pointer-events-none px-4">
        <div className="relative text-center w-full max-w-[90vw]">
          {/* Main Text */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight text-white drop-shadow-2xl">
            <span className="font-sans font-bold">gentle </span>
            <span className="italic font-light tracking-wide mx-2" style={{ fontFamily: 'Playfair Display, serif' }}>natural </span>
            <span className="font-sans font-bold">skincare for</span><br/>
            <span className="font-sans font-bold relative inline-block">
              the most delicate skin
              {/* Sticker - Hidden on mobile */}
              <div className="hidden md:block absolute -right-10 -top-3 animate-float-delayed">
                <img src="/stickers/2.png" alt="sticker" className="w-16 h-16 drop-shadow-lg transform -rotate-12" />
              </div>
            </span>
          </h2>
        </div>
      </main>

      {/* Custom Cursor - Hidden on mobile */}
      <div ref={cursorRef} id="custom-cursor" className="hidden md:block">
        <div className={`cursor-icon text-white ${isClicking ? 'scale-80 -rotate-10' : ''} ${isHovering ? 'scale-120' : ''}`}>
          <FaHandPointUp style={{ transform: 'rotate(-15deg)' }} />
        </div>
      </div>

      {/* Feedback Container */}
      <div ref={feedbackContainerRef} className="fixed inset-0 pointer-events-none z-50 overflow-hidden"></div>
    </div>
  );
};

export default HeroSection;
