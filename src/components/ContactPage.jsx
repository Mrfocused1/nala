import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Heart, Zap, Flame, Send, Mail } from 'lucide-react';
import BurgerMenu from './BurgerMenu';

// --- Components ---

const Marquee = ({ children, direction = 1, angle = 0, speed = 20 }) => {
  return (
    <div
      className="absolute left-0 w-[140vw] -ml-[20vw] overflow-hidden bg-[#c1765b] border-y-2 border-[#fff5eb] py-6 md:py-8 shadow-xl z-10"
      style={{
        transform: `rotate(${angle}deg)`,
        zIndex: Math.floor(Math.random() * 10)
      }}
    >
      <motion.div
        className="flex whitespace-nowrap gap-8"
        animate={{ x: direction === 1 ? ["-25%", "0%"] : ["0%", "-25%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: speed }}
      >
        {/* Quadrupled content to ensure seamless loop without gaps */}
        {[...Array(4)].map((_, groupIndex) => (
          <div key={groupIndex} className="flex shrink-0 items-center gap-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 text-4xl md:text-6xl font-black text-[#fff5eb] uppercase tracking-tighter">
                {children}
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const CustomCursor = ({ text }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[100] hidden md:flex items-center justify-center mix-blend-difference"
      animate={{
        x: mousePosition.x - (text ? 50 : 10),
        y: mousePosition.y - (text ? 50 : 10),
        width: text ? 100 : 20,
        height: text ? 100 : 20,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className={`w-full h-full rounded-full bg-[#c1765b] flex items-center justify-center ${text ? 'scale-100' : 'scale-50'}`}>
         {text && (
            <span className="text-white font-black text-sm tracking-widest animate-pulse">
              {text}
            </span>
          )}
      </div>
    </motion.div>
  );
};

const StickerDecoration = ({ emoji, className, delay = 0 }) => (
  <motion.div
    className={`absolute pointer-events-none select-none z-10 ${className}`}
    initial={{ scale: 0, rotate: -45 }}
    whileInView={{ scale: 1, rotate: 0 }}
    transition={{ type: "spring", bounce: 0.5, delay }}
  >
    {emoji}
  </motion.div>
);

// 3D Tilt Card Component
const TiltCard = ({ children, className, onClick }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="w-full h-full transform-gpu transition-all duration-200 ease-out"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const ContactPage = () => {
  const [status, setStatus] = useState('idle'); // idle | submitting | success
  const [cursorText, setCursorText] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 1500);
  };

  return (
    <div className="w-full min-h-screen bg-[#fff5eb] text-[#333333] font-sans overflow-x-hidden selection:bg-[#c1765b]/20 selection:text-[#c1765b] cursor-none">
      <CustomCursor text={cursorText} />

      {/* Logo */}
      <div className="fixed left-1/2 -translate-x-1/2 top-[20px] z-40 pointer-events-auto">
        <img
          src="/nala-2.png"
          alt="Nala's Baby Logo"
          className="h-16 md:h-20 w-auto drop-shadow-lg hover:scale-105 transition-transform cursor-pointer"
        />
      </div>

      {/* Right: Menu Button */}
      <div className="fixed right-[50px] top-[24px] z-40 pointer-events-auto">
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
              className="absolute -top-[50%] -left-[25%] w-[150%] h-[200%] pointer-events-none overflow-visible"
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

      {/* Burger Menu */}
      <BurgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* --- HERO SECTION: CHAOS MARQUEE --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://videos.pexels.com/video-files/6849063/6849063-hd_1920_1080_24fps.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
           {/* Marquee 1: Tilted Left */}
          <div className="absolute top-1/4 w-full">
             <Marquee angle={-5} direction={1} speed={15}>
                <span>CONTACT</span> <Heart className="fill-current text-[#fff5eb]" size={48} />
                <span>CONTACT</span> <span className="text-outline">US</span>
             </Marquee>
          </div>

          {/* Marquee 2: Tilted Right (Main) */}
          <div className="absolute top-1/3 w-full">
            <Marquee angle={2} direction={-1} speed={20}>
                <span className="text-[#fff5eb]">LET'S</span> <Zap className="fill-current text-[#fff5eb]" size={48} />
                <span>TALK</span> <Flame className="fill-current text-[#fff5eb]" size={48} />
            </Marquee>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-20 z-20 flex flex-col items-center"
          >
            {/* Added Hand-Drawn Arrow SVG */}
            <svg
              className="w-24 h-24 mb-2 text-[#c1765b] stroke-current animate-bounce"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: "drop-shadow(0px 0px 5px rgba(193,118,91,0.5))" }}
            >
              <path
                d="M20 50 C 20 20, 80 20, 80 60"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 70 50 L 80 60 L 90 50"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <p className="text-center font-bold text-base md:text-lg leading-tight text-[#333333]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Get in touch <br/>
              <span className="text-[#c1765b] underline decoration-wavy">we'd love to hear from you!</span>
            </p>
          </motion.div>
        </div>
      </section>


      {/* Global CSS for Stroke Text Effect */}
      <style jsx global>{`
        .text-outline {
          -webkit-text-stroke: 2px #fff5eb;
          color: transparent;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
