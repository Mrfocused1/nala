import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTiktok, FaInstagram, FaFacebook, FaYoutube, FaTwitter } from 'react-icons/fa';

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

const BurgerMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const itemsRef = useRef({});
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const [isPhysicsReady, setIsPhysicsReady] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const menuItems = [
    { name: 'Home', path: '/', width: 180, type: 'link' },
    { name: 'Shop', path: '/shop', width: 180, type: 'link' },
    { name: 'Contact', path: '/contact', width: 200, type: 'link' },
  ];

  const socialItems = [
    { id: 'instagram', text: 'Instagram', type: 'social', width: 70, textCol: '#E4405F', url: 'https://www.instagram.com/nalasbabyuk/', icon: 'instagram' },
    { id: 'tiktok', text: 'TikTok', type: 'social', width: 70, textCol: '#000000', url: 'https://www.tiktok.com/@nalasbaby', icon: 'tiktok' },
    { id: 'facebook', text: 'Facebook', type: 'social', width: 70, textCol: '#1877F2', url: 'https://www.facebook.com/Nalasbaby', icon: 'facebook' },
    { id: 'youtube', text: 'YouTube', type: 'social', width: 70, textCol: '#FF0000', url: 'https://www.youtube.com/channel/UCJ5HnLYb4Aa5yzRfAbZLfSw/', icon: 'youtube' },
    { id: 'twitter', text: 'Twitter', type: 'social', width: 70, textCol: '#1DA1F2', url: 'https://twitter.com/nalasbaby', icon: 'twitter' },
  ];

  const allItems = [...menuItems, ...socialItems];

  const handleLinkClick = (e, path) => {
    e?.stopPropagation();
    if (onClose) {
      onClose();
    }
    // Scroll to top when navigating
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // If path is provided (from touch event), navigate programmatically
    if (path) {
      navigate(path);
    }
  };

  const handleTouchEnd = (e, path) => {
    e.preventDefault();
    e.stopPropagation();
    // Close menu and navigate
    if (onClose) {
      onClose();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Navigate programmatically for touch events
    if (path) {
      navigate(path);
    }
  };

  // Load Matter.js when component mounts
  useEffect(() => {
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js')
      .then(() => setIsPhysicsReady(true))
      .catch(console.error);

    return () => {
      if (runnerRef.current && engineRef.current) {
        const Matter = window.Matter;
        if (Matter && Matter.Runner) {
          Matter.Runner.stop(runnerRef.current);
        }
      }
    };
  }, []);

  // Trigger physics when menu opens
  useEffect(() => {
    if (isOpen && !hasTriggered && isPhysicsReady) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        triggerDrop();
      }, 100);
    }

    // Reset when menu closes
    if (!isOpen) {
      setHasTriggered(false);
      if (runnerRef.current && engineRef.current) {
        const Matter = window.Matter;
        if (Matter && Matter.Runner) {
          Matter.Runner.stop(runnerRef.current);
          Matter.World.clear(engineRef.current.world);
          Matter.Engine.clear(engineRef.current);
        }
      }
    }
  }, [isOpen, isPhysicsReady]);

  const triggerDrop = () => {
    if (!isPhysicsReady || !containerRef.current) return;
    setHasTriggered(true);

    const Matter = window.Matter;
    const { Engine, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Create Engine
    const engine = Engine.create();
    engineRef.current = engine;

    // Walls
    const wallOptions = { isStatic: true, render: { visible: false } };
    const floor = Bodies.rectangle(width / 2, height + 25, width, 50, wallOptions);
    const leftWall = Bodies.rectangle(-25, height / 2, 50, height, wallOptions);
    const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions);

    // Create Bodies for all items (menu + social)
    const itemBodies = allItems.map((item, index) => {
      const x = width / 2 + (Math.random() - 0.5) * 200; // Start near center with more spread
      const y = -100 - index * 60; // Stagger vertically

      const itemWidth = item.width || 70;
      const itemHeight = item.type === 'social' ? 70 : 60;

      const body = item.type === 'social'
        ? Bodies.rectangle(x, y, itemWidth, itemHeight, {
            restitution: 0.6,
            friction: 0.1,
            render: { visible: false },
            label: item.id
          })
        : Bodies.rectangle(x, y, itemWidth, itemHeight, {
            chamfer: { radius: 4 },
            restitution: 0.6,
            friction: 0.1,
            render: { visible: false },
            label: item.path
          });
      return body;
    });

    World.add(engine.world, [floor, leftWall, rightWall, ...itemBodies]);

    // Mouse Control
    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    // Allow scrolling over the canvas if not grabbing
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    World.add(engine.world, mouseConstraint);

    // Runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Render Loop
    const updateLoop = () => {
      if (!containerRef.current) return;

      itemBodies.forEach((body, index) => {
        const item = allItems[index];
        const itemKey = item.type === 'social' ? item.id : item.path;
        const domEl = itemsRef.current[itemKey];

        if (domEl) {
          const { x, y } = body.position;
          const angle = body.angle;
          const itemWidth = item.width || 70;
          const itemHeight = item.type === 'social' ? 70 : 60;

          // Sync DOM to Physics
          domEl.style.transform = `translate(${x - itemWidth / 2}px, ${y - itemHeight / 2}px) rotate(${angle}rad)`;

          // Show element once it falls into view
          if (y > -100) {
            domEl.style.opacity = 1;
          }
        }
      });

      requestAnimationFrame(updateLoop);
    };

    updateLoop();
  };

  return (
    <>
      {/* Full Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#c1765b] z-[90] flex items-center justify-center pointer-events-auto overflow-hidden cursor-default select-none"
          >
            {/* Background Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/menu-background.mp4" type="video/mp4" />
            </video>

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-8 right-8 md:top-12 md:right-12 z-[100] pointer-events-auto group touch-manipulation"
              aria-label="Close menu"
            >
              <div className="relative w-16 h-16 md:w-16 md:h-16 flex items-center justify-center bg-white/20 rounded-full">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-10 h-10 md:w-10 md:h-10 text-white drop-shadow-2xl group-hover:scale-110 transition-transform"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
            </motion.button>

            {/* Physics-based Menu Items */}
            {menuItems.map((item) => (
              <div
                key={item.path}
                ref={el => itemsRef.current[item.path] = el}
                className="absolute top-0 left-0 flex items-center justify-center font-bold uppercase text-sm shadow-lg md:hover:cursor-grab md:active:cursor-grabbing z-50 transition-opacity duration-300 touch-manipulation"
                style={{
                  width: item.width,
                  height: 60,
                  backgroundColor: '#ffffff',
                  color: '#333333',
                  opacity: 0,
                  willChange: 'transform',
                  fontFamily: 'Inter, sans-serif',
                  border: '4px solid #333333',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                  pointerEvents: 'auto'
                }}
              >
                <Link
                  to={item.path}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLinkClick(e);
                  }}
                  onTouchEnd={(e) => {
                    handleTouchEnd(e, item.path);
                  }}
                  className="w-full h-full flex items-center justify-center text-2xl md:text-3xl font-black pointer-events-auto"
                >
                  {item.name}
                </Link>
              </div>
            ))}

            {/* Physics-based Social Icons */}
            {socialItems.map((item) => {
              const renderIcon = () => {
                const iconSize = 60;
                switch (item.icon) {
                  case 'instagram':
                    return <FaInstagram size={iconSize} color={item.textCol} />;
                  case 'tiktok':
                    return <FaTiktok size={iconSize} color={item.textCol} />;
                  case 'facebook':
                    return <FaFacebook size={iconSize} color={item.textCol} />;
                  case 'youtube':
                    return <FaYoutube size={iconSize} color={item.textCol} />;
                  case 'twitter':
                    return <FaTwitter size={iconSize} color={item.textCol} />;
                  default:
                    return item.text;
                }
              };

              return (
                <div
                  key={item.id}
                  ref={el => itemsRef.current[item.id] = el}
                  className="absolute top-0 left-0 flex items-center justify-center md:hover:cursor-grab md:active:cursor-grabbing z-50 transition-opacity duration-300 touch-manipulation"
                  style={{
                    width: item.width,
                    height: item.width,
                    backgroundColor: 'transparent',
                    opacity: 0,
                    willChange: 'transform',
                    pointerEvents: 'auto'
                  }}
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex items-center justify-center pointer-events-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Open link on touch
                      window.open(item.url, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    {renderIcon()}
                  </a>
                </div>
              );
            })}

            {/* Logo at Bottom */}
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.4, type: 'spring', bounce: 0.5 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
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
