import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Camera, ThumbsUp, Zap, Sparkles } from 'lucide-react';

const PROJECTS = [
  {
    id: 1,
    title: "Skibidi School",
    category: "Social Campaign",
    brand: "Hema",
    stickerType: "bam",
    img: "https://picsum.photos/seed/project1/800/1280",
    color: "bg-pink-500"
  },
  {
    id: 2,
    title: "Kipsalon",
    category: "360 Activation",
    brand: "KFC",
    stickerType: "fire",
    img: "https://picsum.photos/seed/project2/800/1280",
    color: "bg-red-600"
  },
  {
    id: 3,
    title: "Lava Wings",
    category: "Product Launch",
    brand: "KFC",
    stickerType: "new",
    img: "https://picsum.photos/seed/project3/800/1280",
    color: "bg-orange-500"
  },
  {
    id: 4,
    title: "Squid Game",
    category: "Reality TV",
    brand: "Netflix",
    stickerType: "camera",
    img: "https://picsum.photos/seed/project4/800/1280",
    color: "bg-red-700"
  },
  {
    id: 5,
    title: "Summer Vibes",
    category: "Influencer",
    brand: "Coca Cola",
    stickerType: "like",
    img: "https://picsum.photos/seed/project5/800/1280",
    color: "bg-blue-600"
  },
];

const Sticker = ({ type }) => {
  const getStickerContent = () => {
    switch (type) {
      case 'bam':
        return (
          <div className="relative group rotate-12">
             <svg viewBox="0 0 100 100" className="w-24 h-24 text-yellow-400 drop-shadow-2xl">
              <path fill="currentColor" d="M50 0 L63 35 L98 35 L70 58 L82 91 L50 72 L18 91 L30 58 L2 35 L37 35 Z" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-black text-red-600 rotate-[-12deg] text-2xl tracking-tighter">BAM!</span>
          </div>
        );
      case 'fire':
        return (
          <div className="bg-gradient-to-tr from-orange-600 to-yellow-400 text-white p-3 rounded-full shadow-2xl border-4 border-white rotate-[-12deg]">
            <Zap size={32} fill="currentColor" />
          </div>
        );
      case 'camera':
        return (
          <div className="bg-neutral-900 text-white px-4 py-2 rounded-xl shadow-2xl border-2 border-white/20 rotate-6 flex items-center gap-2">
            <Camera size={20} />
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span className="font-bold text-xs uppercase tracking-widest text-white">REC</span>
          </div>
        );
      case 'like':
        return (
          <div className="bg-blue-600 text-white p-4 rounded-full shadow-2xl border-[5px] border-white rotate-12">
            <ThumbsUp size={32} fill="currentColor" />
          </div>
        );
      case 'new':
        return (
          <div className="bg-green-400 text-black px-5 py-2 rounded-full shadow-xl border-4 border-black rotate-[-6deg]">
            <span className="font-black italic text-xl">NEW!</span>
          </div>
        );
      default:
        return (
           <div className="bg-purple-500 text-white p-3 rounded-full shadow-xl border-4 border-white rotate-12">
            <Sparkles size={28} fill="currentColor" />
          </div>
        );
    }
  };

  return (
    <motion.div
      className="absolute -top-8 -right-8 z-10"
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
    >
      {getStickerContent()}
    </motion.div>
  );
};

const Card = ({ project, index, onSwipe, totalCards }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Calculate stack offset based on position in stack
  const isTop = index === totalCards - 1;
  const scale = 1 - (totalCards - 1 - index) * 0.05;
  const yOffset = (totalCards - 1 - index) * 10;

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 100;
    const swipeVelocity = 500;

    if (
      Math.abs(info.offset.x) > swipeThreshold ||
      Math.abs(info.velocity.x) > swipeVelocity
    ) {
      const direction = info.offset.x > 0 ? 1 : -1;
      onSwipe(project.id, direction);
    }
  };

  return (
    <motion.div
      className="absolute"
      style={{
        x: isTop ? x : 0,
        y: isTop ? y : yOffset,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1,
        scale,
        zIndex: index,
        cursor: isTop ? 'grab' : 'default',
      }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
      animate={{
        scale,
        y: yOffset,
      }}
      transition={{
        scale: { duration: 0.3 },
        y: { duration: 0.3 },
      }}
    >
      <div className="relative w-[340px] h-[480px] rounded-3xl overflow-hidden bg-neutral-900 shadow-2xl border border-white/10">
        <img
          src={project.img}
          alt={project.title}
          className="w-full h-full object-cover"
          draggable={false}
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

        {/* Top Category Tag */}
        <div className="absolute top-5 left-5">
          <span className={`inline-block px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white rounded-lg ${project.color} shadow-lg`}>
            {project.category}
          </span>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-3xl font-black text-white uppercase leading-none tracking-tighter mb-2">
            {project.title}
          </h2>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/50 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <p className="text-gray-300 font-bold text-xs uppercase tracking-[0.2em]">{project.brand}</p>
          </div>
        </div>

        {isTop && <Sticker type={project.stickerType} />}
      </div>
    </motion.div>
  );
};

export default function PortfolioCarousel() {
  const [cards, setCards] = useState(PROJECTS);

  const handleSwipe = (id, direction) => {
    // Remove the swiped card after animation
    setTimeout(() => {
      setCards((prev) => prev.filter((card) => card.id !== id));
    }, 300);
  };

  const handleReset = () => {
    setCards(PROJECTS);
  };

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col items-center justify-center font-sans py-20">
      {/* Header */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-50">
        <h1 className="text-white font-black text-3xl tracking-tighter">
          truus<span className="text-red-500">.</span>
        </h1>
        <div className="text-white/60 text-sm font-mono">
          {cards.length} / {PROJECTS.length}
        </div>
      </div>

      {/* Card Stack Container */}
      <div className="relative w-[340px] h-[480px] flex items-center justify-center">
        {cards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <h3 className="text-white text-2xl font-bold mb-4">All Done!</h3>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-white text-black font-black rounded-full hover:bg-gray-200 transition-colors"
            >
              Reset Cards
            </button>
          </motion.div>
        ) : (
          cards.map((project, index) => (
            <Card
              key={project.id}
              project={project}
              index={index}
              onSwipe={handleSwipe}
              totalCards={cards.length}
            />
          ))
        )}
      </div>

      {/* Swipe Hint */}
      {cards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-16 text-center"
        >
          <p className="text-white/40 text-sm font-mono uppercase tracking-wider">
            ← Swipe to explore →
          </p>
        </motion.div>
      )}

      {/* Footer */}
      <div className="absolute bottom-10 left-0 right-0 text-center pointer-events-none">
        <div className="inline-flex items-center gap-3 text-neutral-500 text-[10px] font-black uppercase tracking-[0.5em]">
          <span className="w-8 h-[1px] bg-neutral-800"></span>
          <span>Selected Works 2025</span>
          <span className="w-8 h-[1px] bg-neutral-800"></span>
        </div>
      </div>

      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_120%)] opacity-80" />
    </div>
  );
}
