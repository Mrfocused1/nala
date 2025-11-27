import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { MousePointer2, Sparkles, MessageCircle } from 'lucide-react';

/**
 * PARALLAX WRAPPER
 * Adds scroll velocity to elements for depth.
 */
const Parallax = ({ children, offset = 50, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};

/**
 * SECTION 1: MANIFESTO
 * The big text with the circled "young" animation.
 */
const Manifesto = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative w-full px-6 py-32 md:py-48 flex justify-center items-center z-10">
      <div className="max-w-4xl text-center">
        <h1
          ref={ref}
          className="text-4xl md:text-6xl lg:text-7xl leading-[1.1] md:leading-[1.1] font-medium tracking-tight"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          we are a{' '}
          <span className="relative inline-block mx-2">
            young
            {/* Hand-drawn circle SVG */}
            <svg
              className="absolute -top-4 -left-6 w-[140%] h-[150%] pointer-events-none text-white"
              viewBox="0 0 200 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <motion.path
                d="M20,50 C30,20 80,10 120,20 C170,30 190,60 160,80 C130,100 60,90 40,70 C30,60 35,45 50,40"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                strokeLinecap="round"
              />
            </svg>
          </span>
          , future-proof team of 49 digitally native{' '}
          <span className="relative inline-block mx-1">
            <span className="italic opacity-80">wunderkinder</span>
            {/* Hand-drawn wavy underline SVG */}
            <svg
              className="absolute -bottom-2 left-0 w-full h-6 pointer-events-none text-white"
              viewBox="0 0 100 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M2,10 Q25,18 50,10 T98,10"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 0.8, ease: "easeOut", delay: 1.0 }}
                strokeLinecap="round"
              />
            </svg>
          </span>.
          <br className="hidden md:block" /> not to brag!
        </h1>
      </div>
    </section>
  );
};

/**
 * STICKER COMPONENTS
 * Custom CSS/SVG stickers to float around the grid.
 */

const GreenClover = () => (
  <div className="absolute -z-10 w-64 h-64 md:w-96 md:h-96 opacity-90 text-[#1e4a3b]">
    <svg viewBox="0 0 200 200" fill="currentColor">
      <path d="M45.7,-51.3C57.6,-36.4,64.3,-18.2,62.8,-1.5C61.3,15.2,51.6,30.4,39.7,42.8C27.8,55.2,13.9,64.8,-1.7,66.5C-17.3,68.2,-34.6,62,-47.6,49.6C-60.6,37.2,-69.3,18.6,-67.2,2.1C-65.1,-14.4,-52.2,-28.8,-39.2,-43.7C-26.2,-58.6,-13.1,-74,2.7,-76.7C18.5,-79.4,33.8,-66.2,45.7,-51.3Z" transform="translate(100 100)" />
    </svg>
  </div>
);

const GoodVibesSticker = () => (
  <motion.div
    whileHover={{ rotate: 15, scale: 1.1 }}
    className="bg-[#FF4D4D] text-white font-black text-xl md:text-2xl p-6 rounded-full rotate-[-12deg] shadow-lg border-4 border-white flex flex-col items-center justify-center w-32 h-32 md:w-40 md:h-40 text-center leading-none"
  >
    <span>GOOD</span>
    <span className="text-3xl md:text-4xl italic">VIBES</span>
  </motion.div>
);

const FistBumpSticker = () => (
  <div className="bg-[#4D79FF] p-4 rounded-3xl rotate-[12deg] shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 11V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" />
      <path d="M11 13v6m0-6-3-3m3 3h4l3.5-3.5" />
      <path d="M4 11a2 2 0 0 1 2-2h3v10H6a2 2 0 0 1-2-2v-6Z" />
    </svg>
  </div>
);

const HiBubble = () => (
  <div className="relative group">
    <div className="bg-[#6366f1] text-white px-6 py-3 rounded-2xl rounded-bl-none text-2xl font-bold shadow-lg">
      hi
    </div>
    <div className="absolute -bottom-6 -left-4 text-white drop-shadow-lg">
      <MousePointer2 size={48} fill="white" className="stroke-black stroke-[1.5px]" />
    </div>
  </div>
);

const JoinClubBlob = () => (
  <div className="relative w-40 h-40 md:w-48 md:h-48 text-[#2563eb]">
    {/* Abstract Blob */}
    <svg viewBox="0 0 200 200" fill="currentColor" className="w-full h-full animate-float">
      <path d="M42.7,-72.2C54.8,-66.9,63.6,-53.6,71.3,-40.4C79,-27.2,85.6,-14.1,84.1,-1.5C82.6,11.1,73,23.2,63.5,34.4C54,45.6,44.6,55.9,33.5,63.1C22.4,70.3,9.6,74.4,-1.8,77.5C-13.2,80.6,-23.2,82.7,-33.4,77.8C-43.6,72.9,-54,61,-62.8,48.8C-71.6,36.6,-78.8,24.1,-80.3,10.9C-81.8,-2.3,-77.6,-16.2,-69.5,-27.5C-61.4,-38.8,-49.4,-47.5,-37.2,-52.7C-25,-57.9,-12.5,-59.6,1.2,-61.7C14.9,-63.8,29.8,-66.3,42.7,-72.2Z" transform="translate(100 100)" />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center text-center leading-none pointer-events-none">
      <span className="font-black text-[#ccfbf1] text-3xl -rotate-6 drop-shadow-md">
        JOIN<br/>THE<br/>CLUB
      </span>
    </div>
  </div>
);

const LetsGoSticker = () => (
  <div className="bg-white text-black px-4 py-2 rounded-lg -rotate-6 shadow-[4px_4px_0px_0px_#db2777]">
    <span className="font-bold text-xl text-pink-600">Let's GOOOOO!</span>
  </div>
);


/**
 * TEAM MEMBER CARD
 */
const TeamCard = ({ src, alt = "Team member", shape = "rounded" }) => {
  const getClipPath = () => {
    switch (shape) {
      case 'star':
        return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      case 'triangle':
        return 'polygon(50% 0%, 100% 100%, 0% 100%)';
      case 'hexagon':
        return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
      case 'circle':
        return 'circle(50% at 50% 50%)';
      case 'pentagon':
        return 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)';
      case 'blob':
        return 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';
      default:
        return 'none';
    }
  };

  return (
    <motion.div
      className="relative w-full aspect-[4/5] grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer"
      style={{
        clipPath: getClipPath(),
      }}
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ scale: 1.05, rotate: 3 }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
};


/**
 * SECTION 2: THE GRID
 * The messy, scattered layout with scroll experience.
 */
const TeamGrid = () => {
  // Using Lorem Picsum for placeholder images
  const team = [
    { id: 1, img: "https://picsum.photos/seed/team1/800/1000", shape: "star", position: "right", size: "large" },
    { id: 2, img: "https://picsum.photos/seed/team2/800/1000", shape: "circle", position: "left", size: "medium" },
    { id: 3, img: "https://picsum.photos/seed/team3/800/1000", shape: "hexagon", position: "center", size: "large" },
    { id: 4, img: "https://picsum.photos/seed/team4/800/1000", shape: "triangle", position: "right-offset", size: "small" },
    { id: 5, img: "https://picsum.photos/seed/team5/800/1000", shape: "pentagon", position: "center-left", size: "medium" },
    { id: 6, img: "https://picsum.photos/seed/team6/800/1000", shape: "blob", position: "left-offset", size: "large" },
  ];

  const getPositionClasses = (position) => {
    switch (position) {
      case 'left':
        return 'left-0 md:left-[5%]';
      case 'right':
        return 'right-0 md:right-[5%]';
      case 'center':
        return 'left-1/2 -translate-x-1/2';
      case 'center-left':
        return 'left-[10%] md:left-[20%]';
      case 'right-offset':
        return 'right-[5%] md:right-[15%]';
      case 'left-offset':
        return 'left-[15%] md:left-[10%]';
      default:
        return 'left-1/2 -translate-x-1/2';
    }
  };

  const getSizeClasses = (size) => {
    switch (size) {
      case 'small':
        return 'w-[30%] md:w-[15%] max-w-[150px]';
      case 'medium':
        return 'w-[35%] md:w-[18%] max-w-[200px]';
      case 'large':
        return 'w-[40%] md:w-[20%] max-w-[250px]';
      default:
        return 'w-[35%] md:w-[18%] max-w-[200px]';
    }
  };

  return (
    <section className="relative w-full px-4 py-20 min-h-[300vh]">

      {/* Background Decor Layer (Clover) */}
      <Parallax offset={-40} className="absolute top-[20%] left-[10%] z-0">
        <GreenClover />
      </Parallax>

      {/* Freeform Layout */}
      <div className="relative w-full">

        {/* Image 1 - Left, Top */}
        <div className={`relative ${getPositionClasses(team[0].position)} ${getSizeClasses(team[0].size)} mb-[30vh]`}>
          <Parallax offset={20} className="absolute -top-16 -right-12 z-20">
            <GoodVibesSticker />
          </Parallax>
          <TeamCard src={team[0].img} shape={team[0].shape} />
        </div>

        {/* Image 2 - Right */}
        <div className={`relative ${getPositionClasses(team[1].position)} ${getSizeClasses(team[1].size)} mb-[40vh]`}>
          <Parallax offset={-30} className="absolute -top-12 -left-16 z-20">
            <HiBubble />
          </Parallax>
          <TeamCard src={team[1].img} shape={team[1].shape} />
        </div>

        {/* Image 3 - Center-Left */}
        <div className={`relative ${getPositionClasses(team[2].position)} ${getSizeClasses(team[2].size)} mb-[35vh]`}>
          <Parallax offset={40} className="absolute -bottom-8 -right-20 z-20">
            <FistBumpSticker />
          </Parallax>
          <TeamCard src={team[2].img} shape={team[2].shape} />
        </div>

        {/* Image 4 - Right Offset, Small */}
        <div className={`relative ${getPositionClasses(team[3].position)} ${getSizeClasses(team[3].size)} mb-[45vh]`}>
          <TeamCard src={team[3].img} shape={team[3].shape} />
        </div>

        {/* Image 5 - Left Offset */}
        <div className={`relative ${getPositionClasses(team[4].position)} ${getSizeClasses(team[4].size)} mb-[30vh]`}>
          <Parallax offset={30} className="absolute -top-10 -right-12 z-20">
            <LetsGoSticker />
          </Parallax>
          <TeamCard src={team[4].img} shape={team[4].shape} />
        </div>

        {/* Image 6 - Center */}
        <div className={`relative ${getPositionClasses(team[5].position)} ${getSizeClasses(team[5].size)} mb-[20vh]`}>
          <Parallax offset={-40} className="absolute -bottom-16 -left-24 z-20 hidden md:block">
            <JoinClubBlob />
          </Parallax>
          <TeamCard src={team[5].img} shape={team[5].shape} />
        </div>

      </div>
    </section>
  );
};


/**
 * MAIN TEAM SECTION EXPORT
 */
export default function TeamSection() {
  return (
    <div className="bg-black text-white overflow-hidden">
      <Manifesto />
      <TeamGrid />
    </div>
  );
}
