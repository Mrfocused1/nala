import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Star, ThumbsUp, Heart, ArrowDown, Flag, MapPin, Compass, Target, Mountain, Zap, Users, Rocket, ShoppingBag, ArrowRight, Sparkles, Plus } from 'lucide-react';
import { motion, useScroll, useSpring, useTransform, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import BrandsSection from './BrandsSection';
import PhysicsFooter from './PhysicsFooter';

const ScrollExperience = () => {
  const [libLoaded, setLibLoaded] = useState(false);

  // Load GSAP & ScrollTrigger from CDN
  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js')
    ]).then(() => {
      if (window.gsap && window.ScrollTrigger) {
        window.gsap.registerPlugin(window.ScrollTrigger);
        setLibLoaded(true);
      }
    });
  }, []);

  if (!libLoaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#fff5eb] text-[#c1765b] font-mono">
        INITIALIZING CREATIVE EXPERIENCE...
      </div>
    );
  }

  return <ExperienceContent />;
};

// Hover Video Card Component for "Toddler" word
const NaturallyHoverCard = () => {
  const [showVideo, setShowVideo] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const spanRef = useRef(null);

  const handleMouseEnter = () => {
    if (spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect();
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom + 16
      });
    }
    setShowVideo(true);
  };

  return (
    <>
      <span
        ref={spanRef}
        className="cursor-pointer hover:text-[#c1765b] transition-colors inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowVideo(false)}
      >
        Toddler
      </span>
      {showVideo && ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            top: `${position.y}px`,
            left: `${position.x}px`,
            transform: 'translateX(-50%)',
            width: window.innerWidth <= 768 ? '50vw' : '18vw',
            aspectRatio: '4/5',
            background: 'white',
            border: '4px solid #333333',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            zIndex: 9999,
            pointerEvents: 'none',
            animation: 'bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src="https://videos.pexels.com/video-files/6849063/6849063-hd_1920_1080_24fps.mp4" type="video/mp4" />
          </video>
          <style>{`
            @keyframes bounceIn {
              0% { opacity: 0; transform: translateX(-50%) scale(0.8); }
              100% { opacity: 1; transform: translateX(-50%) scale(1); }
            }
          `}</style>
        </div>,
        document.body
      )}
    </>
  );
};

const ExperienceContent = () => {
  const mainRef = useRef(null);
  const marqueeContainer = useRef(null);
  const marqueeTrack = useRef(null);
  const letterRefs = useRef([]);
  const iconRefs = useRef([]);
  const connectorPath = useRef(null);
  const loopPath = useRef(null);
  const snakeTextRef = useRef(null);

  const phrase = "DISCOVER OUR 33% DISCOUNT ACROSS THE WEBSITE FOR ALL PRODUCTS ";
  const chars = phrase.split('').map((char, index) => {
    let icon = null;
    if (index === 14) icon = <img src="/stickers/6.png" alt="sticker" className="inline-block align-middle drop-shadow-lg" style={{ width: '96px', height: '96px', minWidth: '96px', minHeight: '96px', maxWidth: '96px', maxHeight: '96px', transform: 'rotate(8deg)', flexShrink: 0, marginLeft: '8px', marginRight: '8px' }} />;
    if (index === 35) icon = <img src="/stickers/2.png" alt="sticker" className="inline-block align-middle drop-shadow-lg" style={{ width: '96px', height: '96px', minWidth: '96px', minHeight: '96px', maxWidth: '96px', maxHeight: '96px', transform: 'rotate(-12deg)', flexShrink: 0, marginLeft: '8px', marginRight: '8px' }} />;

    return { char, icon, id: index, hasIcon: !!icon };
  });

  useLayoutEffect(() => {
    const ctx = window.gsap.context(() => {
      const gsap = window.gsap;
      const ScrollTrigger = window.ScrollTrigger;

      // --- SNAKE MARQUEE ---
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: marqueeContainer.current,
          start: "top top",
          end: "+=100%",
          scrub: 1,
          pin: true,
          onUpdate: (self) => {
            const progress = self.progress * 15;

            letterRefs.current.forEach((el, i) => {
              if (el) {
                const frequency = 0.3;
                const amplitude = 60;

                const yPos = Math.sin((i * frequency) + progress) * amplitude;
                const rot = Math.cos((i * frequency) + progress) * 15;

                gsap.set(el, { y: yPos, rotation: rot });
              }
            });

            // Apply same animation to icons
            iconRefs.current.forEach((el, i) => {
              if (el) {
                const frequency = 0.3;
                const amplitude = 60;
                // Use the index from the chars array to match the position
                const charIndex = el.dataset.charIndex;
                const yPos = Math.sin((charIndex * frequency) + progress) * amplitude;
                const rot = Math.cos((charIndex * frequency) + progress) * 15;

                gsap.set(el, { y: yPos, rotation: rot });
              }
            });
          }
        }
      });

      tl.to(marqueeTrack.current, {
        x: "-120%",
        ease: "none",
      });

      // --- CONNECTOR LINE ---
      const pathLength = connectorPath.current.getTotalLength();
      gsap.set(connectorPath.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

      gsap.to(connectorPath.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".connector-section",
          start: "top center",
          end: "bottom center",
          scrub: true,
        }
      });

      // --- HERO REVEAL & TIKTOK LOOP ---
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-section",
          start: "center 70%",
        }
      });

      const loopLen = loopPath.current.getTotalLength();
      gsap.set(loopPath.current, { strokeDasharray: loopLen, strokeDashoffset: loopLen, opacity: 1 });

      heroTl.to(loopPath.current, {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: "power2.inOut"
      });

      // --- SNAKE CURVE MARQUEE ANIMATION ---
      if (snakeTextRef.current) {
        gsap.to(snakeTextRef.current, {
          attr: { startOffset: "-25%" },
          duration: 6,
          ease: "none",
          repeat: -1
        });
      }

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="bg-[#fff5eb] text-[#c1765b] overflow-x-hidden font-sans selection:bg-[#c1765b]/20 selection:text-[#c1765b]">

      {/* SNAKE MARQUEE */}
      <div
        ref={marqueeContainer}
        className="h-screen w-full flex items-center overflow-hidden relative z-10 text-[#c1765b]"
      >
        <div
          ref={marqueeTrack}
          className="flex whitespace-nowrap pl-[10vw] items-center will-change-transform"
        >
          {chars.map((item, i) => (
            <React.Fragment key={i}>
              <span
                ref={el => letterRefs.current[i] = el}
                className="text-[12vw] font-black leading-none inline-block origin-center will-change-transform"
                style={{ fontFamily: '"Inter", "Helvetica Neue", sans-serif' }}
              >
                {item.char === ' ' ? '\u00A0' : item.char}
              </span>
              {item.icon && (
                <span
                  ref={el => iconRefs.current.push(el)}
                  data-char-index={i}
                  className="inline-block mx-4 relative -top-4 origin-center will-change-transform"
                  style={{ willChange: 'transform' }}
                >
                  {item.icon}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="absolute bottom-12 left-12 md:bottom-16 md:left-16">
          <svg
            width="300"
            height="60"
            viewBox="0 0 300 60"
            className="overflow-visible"
          >
            <defs>
              <path id="scrollCurvePath" d="M 10,40 Q 80,20 150,40 T 290,40" />
            </defs>
            <text
              fill="#c1765b"
              fontSize="12"
              fontFamily="monospace"
              className="opacity-60 animate-pulse uppercase tracking-wider"
            >
              <textPath href="#scrollCurvePath" startOffset="0%">
                SCROLL TO EXPLORE
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      {/* CONNECTOR SECTION */}
      <div className="connector-section h-[25vh] w-full relative z-0 flex justify-center">
         <svg
            className="w-full h-full absolute top-0 left-0"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
         >
            <path
              ref={connectorPath}
              d="M 80 0 C 80 40, 50 20, 50 100"
              fill="none"
              stroke="#c1765b"
              strokeWidth="0.8"
              opacity="0.8"
            />
         </svg>
      </div>

      {/* HERO REVEAL */}
      <div className="hero-section min-h-[15vh] w-full flex flex-col items-center justify-center relative pt-2 md:pt-4 pb-2 md:pb-4">

        <h2 className="text-[4vw] md:text-[3vw] font-bold tracking-tight text-center max-w-4xl leading-tight text-[#333333]">
          Skincare <span className="italic font-light tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>lovingly</span> crafted for <br />
          the gentlest souls.
        </h2>

        <div className="mt-8 relative flex justify-center">
          <p className="text-[6vw] md:text-[5vw] font-black uppercase tracking-tighter relative z-10 text-[#333333] text-center">
            From Newborn to <span className="relative inline-block">
              <span className="italic font-light tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}><NaturallyHoverCard /></span>
              <svg
                className="absolute -top-[20%] -left-[5%] w-[110%] h-[120%] pointer-events-none overflow-visible"
                viewBox="0 0 200 100"
              >
                <path
                  ref={loopPath}
                  d="M 20 40 C 20 20, 80 10, 150 20 C 200 30, 190 80, 140 85 C 90 90, 30 80, 25 50"
                  fill="none"
                  stroke="#c1765b"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="opacity-0"
                />
              </svg>
            </span>
          </p>
        </div>

        <div className="mt-32 max-w-lg text-center text-[#6c757d] text-base md:text-lg font-light" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Naturally derived ingredients, paediatrician approved, and made in Britain. Clean, gentle skincare your whole family can trust — from first bath to bedtime cuddles.
        </div>

      </div>

      {/* SNAKE CURVE MARQUEE */}
      <div className="w-full relative py-1 bg-transparent">
        <svg
          className="w-full h-auto block relative z-0"
          viewBox="0 0 1440 350"
          preserveAspectRatio="none"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <path id="snakeCurvePath" d="M -200,175 C 300,-50 800,400 1640,175" />
          </defs>

          {/* Terracotta Background Strip */}
          <use
            href="#snakeCurvePath"
            fill="none"
            stroke="#c1765b"
            strokeWidth="140"
            strokeLinecap="round"
          />

          {/* Text on Path */}
          <text
            fill="white"
            fontSize="50"
            dy="15"
          >
            <textPath href="#snakeCurvePath" startOffset="0%" ref={snakeTextRef}>
              <tspan fontFamily="'Inter', sans-serif" fontWeight="700" letterSpacing="2">NATURALLY </tspan>
              <tspan fontFamily="'Playfair Display', serif" fontWeight="300" fontStyle="italic" letterSpacing="2">gentle</tspan>
              <tspan fontFamily="'Inter', sans-serif" fontWeight="700" letterSpacing="2"> • DERMATOLOGIST </tspan>
              <tspan fontFamily="'Playfair Display', serif" fontWeight="300" fontStyle="italic" letterSpacing="2">approved</tspan>
              <tspan fontFamily="'Inter', sans-serif" fontWeight="700" letterSpacing="2"> • NATURALLY </tspan>
              <tspan fontFamily="'Playfair Display', serif" fontWeight="300" fontStyle="italic" letterSpacing="2">gentle</tspan>
              <tspan fontFamily="'Inter', sans-serif" fontWeight="700" letterSpacing="2"> • DERMATOLOGIST </tspan>
              <tspan fontFamily="'Playfair Display', serif" fontWeight="300" fontStyle="italic" letterSpacing="2">approved</tspan>
              <tspan fontFamily="'Inter', sans-serif" fontWeight="700" letterSpacing="2"> • NATURALLY </tspan>
              <tspan fontFamily="'Playfair Display', serif" fontWeight="300" fontStyle="italic" letterSpacing="2">gentle</tspan>
              <tspan fontFamily="'Inter', sans-serif" fontWeight="700" letterSpacing="2"> • DERMATOLOGIST </tspan>
              <tspan fontFamily="'Playfair Display', serif" fontWeight="300" fontStyle="italic" letterSpacing="2">approved</tspan>
              <tspan fontFamily="'Inter', sans-serif" fontWeight="700" letterSpacing="2"> •</tspan>
            </textPath>
          </text>
        </svg>
      </div>

      {/* SHOP SECTION */}
      <ShopSection />

      {/* JOURNEY SECTION */}
      <JourneySection />

      {/* BRANDS SECTION */}
      <BrandsSection />

      {/* PHYSICS FOOTER */}
      <PhysicsFooter />

    </div>
  );
};

// Shop Section Component
const ShopSection = () => {
  const [libLoaded, setLibLoaded] = useState(false);
  const shopContainer = useRef(null);
  const shopTrack = useRef(null);

  // 1. Data Source
  const products = [
    {
      id: "01",
      name: "Original Adventure Bundle",
      image: "/products/product1.png"
    },
    {
      id: "02",
      name: "Luxury Gift Set",
      image: "/products/product2.png"
    },
    {
      id: "03",
      name: "Original Skin Trio",
      image: "/products/product3.png"
    },
    {
      id: "04",
      name: "Baby Wash Set",
      image: "/products/product4.png"
    },
  ];

  // 2. Load GSAP (Only needed if running standalone)
  useEffect(() => {
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    if (!window.gsap) {
      Promise.all([
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'),
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js')
      ]).then(() => {
        window.gsap.registerPlugin(window.ScrollTrigger);
        setLibLoaded(true);
      });
    } else {
      setLibLoaded(true);
    }
  }, []);

  // 3. The Animation Logic
  useLayoutEffect(() => {
    if (!libLoaded) return;

    if (!shopContainer.current || !shopTrack.current) {
      console.error('ShopSection: Refs not available!');
      return;
    }

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    const ctx = gsap.context(() => {
      // Set initial position offset from left edge
      const initialOffset = window.innerWidth * 0.20; // 20vw initial offset
      gsap.set(shopTrack.current, { x: initialOffset });

      // Calculate the total scrollable width
      const trackWidth = shopTrack.current.scrollWidth;
      const scrollAmount = -(trackWidth - window.innerWidth + initialOffset);

      // Responsive scroll distance - more on mobile, less on desktop
      const isMobile = window.innerWidth < 768;
      const scrollMultiplier = isMobile ? 1.2 : 0.25;

      gsap.to(shopTrack.current, {
        x: scrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: shopContainer.current,
          start: "top top",
          end: () => `+=${Math.abs(scrollAmount) * scrollMultiplier}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });
    }, shopContainer);

    return () => ctx.revert();
  }, [libLoaded]);

  if (!libLoaded) return <div className="h-screen bg-[#ffeddb] text-[#c1765b] flex items-center justify-center">Loading Shop...</div>;

  return (
    <div className="bg-[#ffeddb] text-[#c1765b] font-sans">

      {/* --- SHOP SECTION START --- */}
      <div ref={shopContainer} className="relative h-screen bg-[#ffeddb] border-t border-[#c1765b]/20 flex flex-col justify-center overflow-hidden">

        {/* Section Header */}
        <div className="absolute top-10 left-0 w-full flex justify-between items-end z-10" style={{ paddingLeft: '80px', paddingRight: '40px' }}>
          <div>
            <h2 className="text-4xl md:text-6xl font-bold leading-none text-[#333333]">
              Browse <span className="italic font-light tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>Collection</span>
            </h2>
          </div>
          <div className="hidden md:flex gap-2 text-sm font-mono text-[#333333]/70">
            <span>SCROLL</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Horizontal Track */}
        <div ref={shopTrack} className="flex gap-[5vw] w-fit items-start h-[60vh]">
            {products.map((product, i) => (
            <Link
              key={i}
              to={`/shop/${product.id}`}
              className="group relative w-[50vw] md:w-[18vw] cursor-pointer"
              style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
            >
              {/* Product Image Container */}
              <div className="relative aspect-[2/3] overflow-hidden bg-white border-2 border-[#333333]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Hover Button */}
                <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-[#c1765b] text-white px-6 md:px-8 py-3 uppercase tracking-widest text-xs md:text-sm font-bold hover:bg-white hover:text-[#c1765b] border-2 border-[#c1765b] transition-all" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    VIEW PRODUCT
                  </button>
                </div>
              </div>

              {/* Product Info - Outside Card */}
              <div className="mt-3 md:mt-4">
                <h3 className="text-[10px] md:text-xs font-sans font-bold text-[#333333] uppercase">
                  {product.name}
                </h3>
              </div>
            </Link>
            ))}

          {/* "View All" Card */}
          <div className="w-[50vw] md:w-[18vw] h-auto aspect-[2/3] flex items-center justify-center border border-dashed border-[#c1765b]/30 hover:bg-white hover:border-[#c1765b] transition-colors cursor-pointer group rounded-2xl">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full border border-[#c1765b]/30 flex items-center justify-center group-hover:scale-110 group-hover:border-[#c1765b] transition-all">
                <ArrowRight className="w-6 h-6 text-[#c1765b]" />
              </div>
              <span className="font-mono text-sm tracking-widest text-[#c1765b]">VIEW ALL</span>
            </div>
          </div>

        </div>
      </div>
      {/* --- SHOP SECTION END --- */}

    </div>
  );
};

// Journey Section Component
const JourneySection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 20,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#ffeddb] overflow-hidden">
      {/* Scroll Path */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M 50 0
               C 50 10, 20 10, 20 18
               C 20 28, 80 28, 80 36
               C 80 46, 20 46, 20 54
               C 20 64, 80 64, 80 72
               C 80 85, 50 85, 50 100"
            stroke="#d4d4d4"
            strokeWidth="2"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />

          <motion.path
            d="M 50 0
               C 50 10, 20 10, 20 18
               C 20 28, 80 28, 80 36
               C 80 46, 20 46, 20 54
               C 20 64, 80 64, 80 72
               C 80 85, 50 85, 50 100"
            stroke="#c1765b"
            strokeWidth="2"
            fill="none"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: scaleY }}
          />
        </svg>
      </div>

      {/* Hero */}
      <div className="relative z-10 h-screen flex flex-col items-center justify-center text-center px-8 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-black text-[#333333] tracking-tighter mb-6">
            WHY <span className="italic font-light tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>FAMILIES</span> TRUST US<span className="text-[#333333]">.</span>
          </h1>
          <p className="text-base md:text-lg text-[#6c757d] max-w-2xl mx-auto leading-relaxed text-center px-4 md:px-0" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Award-winning, naturally derived skincare that puts your <span className="italic font-light tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>family's</span> health first — every single day.
          </p>
        </motion.div>

        <motion.div
          className="absolute bottom-12 text-[#c1765b]"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown size={32} />
        </motion.div>
      </div>

      {/* Sections */}
      <div className="relative pb-32">
        {/* Natural Ingredients Section with Image Containers */}
        <NaturalIngredientsStage />


        <SensitiveSkinStage />

        <AwardWinningStage />

        <MadeInBritainStage />

        <div className="relative z-10 min-h-screen flex items-center justify-center px-8 md:px-20 lg:px-40 py-24">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-[70%] lg:w-[60%] text-center"
          >
            <h2 className="text-4xl md:text-6xl font-black text-[#333333] mb-6 leading-tight">Your Family's <span className="italic font-light tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>Choice</span></h2>
            <p className="text-base md:text-lg text-[#6c757d] leading-relaxed px-4 md:px-0" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Thousands of families trust Nala's Baby for their little ones' skincare needs. Join our community and discover gentle, natural products that work — all at a price that makes clean beauty accessible to everyone. Because every baby deserves the very best.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Sensitive Skin Safe Stage Component with Image Containers
const SensitiveSkinStage = () => {
  const ref = useRef(null);
  const [padding, setPadding] = useState(160);
  const [isSwapped, setIsSwapped] = useState(false);

  useEffect(() => {
    const updatePadding = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setPadding(60);
      } else if (width < 1024) {
        setPadding(120);
      } else {
        setPadding(200);
      }
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const handleTap = () => {
    if (window.innerWidth < 768) {
      setIsSwapped(!isSwapped);
    }
  };

  return (
    <div ref={ref} className="relative z-10 w-full min-h-screen flex items-center py-24 px-12 md:px-32 lg:px-48 xl:px-56 2xl:px-72">
      <motion.div
        style={{ y, opacity }}
        className="w-full flex flex-col md:flex-row-reverse items-center gap-12 md:gap-16"
      >
        {/* Right Side: Text Content */}
        <div className="max-w-3xl text-left" style={{ paddingLeft: `${padding}px` }}>
          <h2 className="text-4xl md:text-6xl font-black text-[#333333] mb-8 md:mb-10 leading-tight">
            <span className="italic font-light tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>Sensitive</span> Skin Safe
          </h2>
          <p className="text-base md:text-lg text-[#8b5a3c] leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Specially formulated for the most delicate skin. Paediatrician approved and dermatologist tested, our products are kind to sensitive skin — from newborns to toddlers and beyond. Safe, gentle care your whole family can trust.
          </p>
        </div>

        {/* Left Side: Two Overlapping Image Containers */}
        <div className="relative w-full md:w-auto flex justify-center md:justify-start md:cursor-default cursor-pointer" style={{ minWidth: '280px' }} onClick={handleTap}>
          <motion.div
            className={`w-48 md:w-56 h-64 md:h-80 rounded-xl border-2 border-white overflow-hidden relative ${isSwapped ? 'z-0' : 'z-10'}`}
            whileHover={{ scale: 1.05, zIndex: 20 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="https://images.pexels.com/photos/3737154/pexels-photo-3737154.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Sensitive skin care"
              className="w-full h-full object-cover"
            />
            {/* Sticker */}
            <motion.img
              src="/stickers/5.png"
              alt="Duck sticker"
              className="absolute bottom-4 left-4 w-16 h-16 md:w-20 md:h-20 pointer-events-none drop-shadow-lg"
              initial={{ scale: 0, rotate: 45 }}
              whileInView={{ scale: 1, rotate: 8 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
            />
          </motion.div>

          <motion.div
            className={`w-48 md:w-56 h-64 md:h-80 rounded-xl border-2 border-white overflow-hidden absolute left-24 md:left-28 top-8 md:top-12 ${isSwapped ? 'z-10' : 'z-0'}`}
            whileHover={{ scale: 1.05, zIndex: 20 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="https://images.pexels.com/photos/4473602/pexels-photo-4473602.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Baby skin care"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Award-Winning Care Stage Component with Image Containers
const AwardWinningStage = () => {
  const ref = useRef(null);
  const [padding, setPadding] = useState(160);
  const [isSwapped, setIsSwapped] = useState(false);

  useEffect(() => {
    const updatePadding = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setPadding(60);
      } else if (width < 1024) {
        setPadding(120);
      } else {
        setPadding(200);
      }
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const handleTap = () => {
    if (window.innerWidth < 768) {
      setIsSwapped(!isSwapped);
    }
  };

  return (
    <div ref={ref} className="relative z-10 w-full min-h-screen flex items-center py-24 px-12 md:px-32 lg:px-48 xl:px-56 2xl:px-72">
      <motion.div
        style={{ y, opacity }}
        className="w-full flex flex-col md:flex-row items-center gap-12 md:gap-16"
      >
        {/* Left Side: Text Content */}
        <div className="max-w-3xl text-right" style={{ paddingRight: `${padding}px` }}>
          <h2 className="text-4xl md:text-6xl font-black text-[#333333] mb-8 md:mb-10 leading-tight">
            Award-Winning <span className="italic font-light tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>Care</span>
          </h2>
          <p className="text-base md:text-lg text-[#8b5a3c] leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Recognised for excellence. Our award-winning formulas combine trusted ingredients with real results. Vegan, cruelty-free, and loved by families across the UK. Clean skincare that truly delivers.
          </p>
        </div>

        {/* Right Side: Two Overlapping Image Containers */}
        <div className="relative w-full md:w-auto flex justify-center md:justify-start md:cursor-default cursor-pointer" style={{ minWidth: '280px' }} onClick={handleTap}>
          <motion.div
            className={`w-48 md:w-56 h-64 md:h-80 rounded-xl border-2 border-white overflow-hidden relative ${isSwapped ? 'z-0' : 'z-10'}`}
            whileHover={{ scale: 1.05, zIndex: 20 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="https://images.pexels.com/photos/6624310/pexels-photo-6624310.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Award winning products"
              className="w-full h-full object-cover"
            />
            {/* Sticker */}
            <motion.img
              src="/stickers/11.png"
              alt="Sun sticker"
              className="absolute top-4 left-4 w-16 h-16 md:w-20 md:h-20 pointer-events-none drop-shadow-lg"
              initial={{ scale: 0, rotate: -45 }}
              whileInView={{ scale: 1, rotate: -15 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
            />
          </motion.div>

          <motion.div
            className={`w-48 md:w-56 h-64 md:h-80 rounded-xl border-2 border-white overflow-hidden absolute left-24 md:left-28 top-8 md:top-12 ${isSwapped ? 'z-10' : 'z-0'}`}
            whileHover={{ scale: 1.05, zIndex: 20 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="https://images.pexels.com/photos/7282308/pexels-photo-7282308.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Quality care"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Made in Britain Stage Component with Image Containers
const MadeInBritainStage = () => {
  const ref = useRef(null);
  const [padding, setPadding] = useState(160);
  const [isSwapped, setIsSwapped] = useState(false);

  useEffect(() => {
    const updatePadding = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setPadding(60);
      } else if (width < 1024) {
        setPadding(120);
      } else {
        setPadding(200);
      }
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const handleTap = () => {
    if (window.innerWidth < 768) {
      setIsSwapped(!isSwapped);
    }
  };

  return (
    <div ref={ref} className="relative z-10 w-full min-h-screen flex items-center py-24 px-12 md:px-32 lg:px-48 xl:px-56 2xl:px-72">
      <motion.div
        style={{ y, opacity }}
        className="w-full flex flex-col md:flex-row-reverse items-center gap-12 md:gap-16"
      >
        {/* Right Side: Text Content */}
        <div className="max-w-3xl text-left" style={{ paddingLeft: `${padding}px` }}>
          <h2 className="text-4xl md:text-6xl font-black text-[#333333] mb-8 md:mb-10 leading-tight">
            Made in <span className="italic font-light tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>Britain</span>
          </h2>
          <p className="text-base md:text-lg text-[#8b5a3c] leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Proudly made in Britain with care and integrity. We're committed to ethical production, sustainable practices, and making clean skincare accessible to every family. Quality you can see, trust you can feel.
          </p>
        </div>

        {/* Left Side: Two Overlapping Image Containers */}
        <div className="relative w-full md:w-auto flex justify-center md:justify-start md:cursor-default cursor-pointer" style={{ minWidth: '280px' }} onClick={handleTap}>
          <motion.div
            className={`w-48 md:w-56 h-64 md:h-80 rounded-xl border-2 border-white overflow-hidden relative ${isSwapped ? 'z-0' : 'z-10'}`}
            whileHover={{ scale: 1.05, zIndex: 20 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="https://images.pexels.com/photos/3992933/pexels-photo-3992933.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Made in Britain"
              className="w-full h-full object-cover"
            />
            {/* Sticker */}
            <motion.img
              src="/stickers/8.png"
              alt="Hot air balloon sticker"
              className="absolute bottom-4 right-4 w-16 h-16 md:w-20 md:h-20 pointer-events-none drop-shadow-lg"
              initial={{ scale: 0, rotate: 45 }}
              whileInView={{ scale: 1, rotate: 12 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
            />
          </motion.div>

          <motion.div
            className={`w-48 md:w-56 h-64 md:h-80 rounded-xl border-2 border-white overflow-hidden absolute left-24 md:left-28 top-8 md:top-12 ${isSwapped ? 'z-10' : 'z-0'}`}
            whileHover={{ scale: 1.05, zIndex: 20 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="https://images.pexels.com/photos/8088495/pexels-photo-8088495.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Quality production"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Natural Ingredients Stage Component with Image Containers
const NaturalIngredientsStage = () => {
  const ref = useRef(null);
  const [padding, setPadding] = useState(160);
  const [isSwapped, setIsSwapped] = useState(false);

  useEffect(() => {
    const updatePadding = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // Mobile
        setPadding(60);
      } else if (width < 1024) {
        // Tablet
        setPadding(120);
      } else {
        // Desktop
        setPadding(200);
      }
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const handleTap = () => {
    if (window.innerWidth < 768) {
      setIsSwapped(!isSwapped);
    }
  };

  return (
    <div ref={ref} className="relative z-10 w-full min-h-screen flex items-center py-24 px-12 md:px-32 lg:px-48 xl:px-56 2xl:px-72">
      <motion.div
        style={{ y, opacity }}
        className="w-full flex flex-col md:flex-row items-center gap-12 md:gap-16"
      >
        {/* Left Side: Text Content */}
        <div className="max-w-3xl text-right" style={{ paddingRight: `${padding}px` }}>
          <h2 className="text-4xl md:text-6xl font-black text-[#333333] mb-8 md:mb-10 leading-tight">
            Natural <span className="italic font-light tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>Ingredients</span>
          </h2>
          <p className="text-base md:text-lg text-[#8b5a3c] leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            We believe in the power of nature. Every product is lovingly crafted with naturally derived ingredients — gentle on delicate skin, free from harsh chemicals. Because what goes on your baby's skin matters just as much as what doesn't.
          </p>
        </div>

        {/* Right Side: Two Overlapping Image Containers */}
        <div className="relative w-full md:w-auto flex justify-center md:justify-start md:cursor-default cursor-pointer" style={{ minWidth: '280px' }} onClick={handleTap}>
          {/* First Image Container */}
          <motion.div
            className={`w-48 md:w-56 h-64 md:h-80 rounded-xl border-2 border-white overflow-hidden relative ${isSwapped ? 'z-0' : 'z-10'}`}
            whileHover={{ scale: 1.05, zIndex: 20 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="https://images.pexels.com/photos/5582608/pexels-photo-5582608.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Natural ingredients"
              className="w-full h-full object-cover"
            />
            {/* Sticker */}
            <motion.img
              src="/stickers/10.png"
              alt="Leaf sticker"
              className="absolute top-4 right-4 w-16 h-16 md:w-20 md:h-20 pointer-events-none drop-shadow-lg"
              initial={{ scale: 0, rotate: -45 }}
              whileInView={{ scale: 1, rotate: -12 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
            />
          </motion.div>

          {/* Second Image Container - Overlapping */}
          <motion.div
            className={`w-48 md:w-56 h-64 md:h-80 rounded-xl border-2 border-white overflow-hidden absolute left-24 md:left-28 top-8 md:top-12 ${isSwapped ? 'z-10' : 'z-0'}`}
            whileHover={{ scale: 1.05, zIndex: 20 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="https://images.pexels.com/photos/3683056/pexels-photo-3683056.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Baby skincare"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Individual Journey Stage Component
const JourneyStage = ({ align, title, children, icon: Icon, index }) => {
  const ref = useRef(null);
  const [padding, setPadding] = useState(160);

  useEffect(() => {
    const updatePadding = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // Mobile
        setPadding(60);
      } else if (width < 1024) {
        // Tablet
        setPadding(120);
      } else {
        // Desktop
        setPadding(200);
      }
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="relative z-10 w-full min-h-screen flex items-center py-24 px-12 md:px-32 lg:px-48 xl:px-56 2xl:px-72">
      <motion.div
        style={{
          y,
          opacity,
          paddingLeft: align === 'right' ? `${padding}px` : '0px',
          paddingRight: align === 'left' ? `${padding}px` : '0px',
          marginLeft: align === 'right' ? 'auto' : '0',
          marginRight: align === 'left' ? 'auto' : '0'
        }}
        className={`max-w-3xl ${align === 'right' ? 'text-left' : 'text-right'}`}
      >
        <h2 className="text-4xl md:text-6xl font-black text-[#333333] mb-8 md:mb-10 leading-tight">{title}</h2>
        <p className="text-base md:text-lg text-[#8b5a3c] leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {children}
        </p>
      </motion.div>
    </div>
  );
};

/* =============================================================================
  CUSTOM CURSOR COMPONENT - Nala's Baby Edition
  Magnetic feel, follows mouse, expands on hover.
  =============================================================================
*/
const CustomCursor = ({ cursorVariant }) => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    const moveCursor = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY]);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 flex items-center justify-center rounded-full mix-blend-difference bg-[#c1765b]"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={cursorVariant}
      variants={{
        default: {
          width: 16,
          height: 16,
          opacity: 1
        },
        hover: {
          width: 80,
          height: 80,
          opacity: 1
        }
      }}
    >
      <motion.span
        className="text-[10px] font-bold text-white uppercase tracking-widest"
        animate={{ opacity: cursorVariant === 'hover' ? 1 : 0 }}
      >
        View
      </motion.span>
    </motion.div>
  );
};

/* =============================================================================
  PRODUCT CARD COMPONENT with Parallax
  =============================================================================
*/
const ProductCard = ({ product, index, x, setCursorVariant }) => {
  const imageParallax = useTransform(x, (latest) => {
    return latest * 0.1;
  });

  return (
    <motion.div
      className="group relative h-[60vh] w-[40vh] md:h-[70vh] md:w-[50vh] flex-shrink-0 cursor-none select-none overflow-hidden bg-[#fff5eb] rounded-3xl"
      onMouseEnter={() => setCursorVariant("hover")}
      onMouseLeave={() => setCursorVariant("default")}
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
      viewport={{ once: true }}
    >
      <div className="h-full w-full overflow-hidden">
        <motion.div
          className="relative h-[120%] w-[120%] -left-[10%] -top-[10%]"
          style={{ x: imageParallax }}
        >
          <motion.img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-105"
          />
        </motion.div>
      </div>

      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 z-10 bg-gradient-to-t from-[#c1765b]/80 via-[#c1765b]/20 to-transparent">
        <div className="flex justify-between items-start opacity-0 transform -translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
          {product.tag && (
            <span className="bg-[#c1765b] backdrop-blur-md px-3 py-1 text-xs uppercase tracking-widest text-white">
              {product.tag}
            </span>
          )}
        </div>

        <div className="relative">
          <div className="absolute -left-4 top-0 h-full w-[1px] bg-[#c1765b]/40 scale-y-0 transition-transform duration-500 origin-bottom group-hover:scale-y-100" />

          <h3 className="text-3xl md:text-4xl font-black uppercase text-white leading-none mb-2 translate-y-4 transition-transform duration-500 group-hover:translate-y-0 tracking-tight">
            {product.name}
          </h3>
          <div className="overflow-hidden">
            <p className="text-sm text-white/80 uppercase tracking-widest translate-y-full transition-transform duration-500 delay-75 group-hover:translate-y-0">
              {product.collection}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-end border-t border-white/20 pt-4">
            <button className="rounded-full bg-[#c1765b] p-2 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-[#a0624a]">
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* =============================================================================
  PRODUCT SLIDER - Horizontal Scroll with Physics
  =============================================================================
*/
const ProductSlider = () => {
  const targetRef = useRef(null);
  const [cursorVariant, setCursorVariant] = useState("default");

  const products = [
    {
      id: 1,
      name: "Gentle Bath Wash",
      collection: "Bathtime Collection",
      price: "£12.99",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2574&auto=format&fit=crop",
      tag: "Bestseller"
    },
    {
      id: 2,
      name: "Nourishing Lotion",
      collection: "Daily Care",
      price: "£14.99",
      image: "https://images.unsplash.com/photo-1584646098378-0874589d76b1?q=80&w=2670&auto=format&fit=crop",
      tag: "New Arrival"
    },
    {
      id: 3,
      name: "Soothing Cream",
      collection: "Sensitive Skin",
      price: "£9.99",
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=2574&auto=format&fit=crop",
      tag: "Gentle"
    },
    {
      id: 4,
      name: "Baby Shampoo",
      collection: "Hair Care",
      price: "£11.99",
      image: "https://images.unsplash.com/photo-1607013407627-6ee73fa0f3b2?q=80&w=2574&auto=format&fit=crop",
      tag: null
    },
    {
      id: 5,
      name: "Massage Oil",
      collection: "Bonding Time",
      price: "£16.99",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2620&auto=format&fit=crop",
      tag: "Award Winner"
    }
  ];

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.5,
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  });

  const x = useTransform(smoothProgress, [0, 1], ["0%", "-75%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [0.95, 1]);

  return (
    <>
      <CustomCursor cursorVariant={cursorVariant} />

      <div ref={targetRef} className="relative h-[400vh] bg-[#ffeddb]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">

          <motion.div
            style={{ opacity, scale }}
            className="absolute left-8 top-12 z-20 md:left-20 md:top-20 pointer-events-none"
          >
            <h2 className="text-6xl md:text-9xl font-black uppercase text-[#c1765b] tracking-tighter leading-[0.85]">
              Shop<br />Now
            </h2>
            <div className="mt-6 flex items-center gap-4">
              <span className="h-[1px] w-12 bg-[#c1765b]"></span>
              <p className="text-sm font-light uppercase tracking-[0.2em] text-[#6c757d]">
                Natural Skincare for Little Ones
              </p>
            </div>
          </motion.div>

          <motion.div
            style={{ x }}
            className="flex gap-4 px-8 md:gap-12 md:px-20 pl-[100vw] md:pl-[40vw]"
          >
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                x={x}
                setCursorVariant={setCursorVariant}
              />
            ))}

            <div className="flex h-[60vh] w-[40vh] md:h-[70vh] md:w-[50vh] flex-shrink-0 items-center justify-center border border-[#c1765b]/20 bg-white/80 backdrop-blur-sm transition-colors hover:bg-white rounded-3xl">
               <div className="text-center group cursor-pointer"
                    onMouseEnter={() => setCursorVariant("hover")}
                    onMouseLeave={() => setCursorVariant("default")}>
                 <div className="mb-6 flex justify-center">
                    <div className="rounded-full border border-[#c1765b] p-8 transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#c1765b] group-hover:text-white text-[#c1765b]">
                      <ArrowRight size={32} />
                    </div>
                 </div>
                 <h3 className="text-4xl font-black uppercase text-[#c1765b]">View All</h3>
                 <p className="text-sm text-[#6c757d] mt-2 uppercase tracking-widest">All Products</p>
               </div>
            </div>

            <div className="w-[10vw] flex-shrink-0" />
          </motion.div>

          <div className="absolute bottom-12 left-0 right-0 px-12 md:px-20">
            <div className="h-[1px] w-full bg-[#c1765b]/20">
              <motion.div
                style={{ scaleX: smoothProgress, transformOrigin: "left" }}
                className="h-full bg-[#c1765b]"
              />
            </div>
            <div className="mt-4 flex justify-between text-xs text-[#6c757d] uppercase tracking-widest">
              <span>Scroll to Explore</span>
              <span>{products.length} Featured Items</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default ScrollExperience;
