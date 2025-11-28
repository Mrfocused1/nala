import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import { FaTiktok, FaInstagram, FaFacebook, FaYoutube, FaTwitter } from 'react-icons/fa';

// Footer items adapted for Nala's Baby
const FOOTER_ITEMS = [
  { id: 'shop-1', text: 'Body Wash', type: 'link', width: 180, bg: 'transparent', textCol: '#c1765b' },
  { id: 'shop-2', text: 'Lotions', type: 'link', width: 140, bg: 'transparent', textCol: '#c1765b' },
  { id: 'shop-3', text: 'Hair Care', type: 'link', width: 160, bg: 'transparent', textCol: '#c1765b' },
  { id: 'shop-4', text: 'Bundles', type: 'link', width: 140, bg: 'transparent', textCol: '#c1765b' },

  { id: 'help-1', text: 'Shipping', type: 'link', width: 150, bg: 'transparent', textCol: '#c1765b' },
  { id: 'help-2', text: 'Returns', type: 'link', width: 140, bg: 'transparent', textCol: '#c1765b' },
  { id: 'help-3', text: 'FAQ', type: 'link', width: 80, bg: 'transparent', textCol: '#c1765b' },
  { id: 'help-4', text: 'Contact', type: 'link', width: 140, bg: 'transparent', textCol: '#c1765b' },

  { id: 'soc-1', text: 'Instagram', type: 'social', width: 70, bg: 'transparent', textCol: '#E4405F', url: 'https://www.instagram.com/nalasbabyuk/', icon: 'instagram' },
  { id: 'soc-2', text: 'TikTok', type: 'social', width: 70, bg: 'transparent', textCol: '#000000', url: 'https://www.tiktok.com/@nalasbaby', icon: 'tiktok' },
  { id: 'soc-3', text: 'Facebook', type: 'social', width: 70, bg: 'transparent', textCol: '#1877F2', url: 'https://www.facebook.com/Nalasbaby', icon: 'facebook' },
  { id: 'soc-4', text: 'YouTube', type: 'social', width: 70, bg: 'transparent', textCol: '#FF0000', url: 'https://www.youtube.com/channel/UCJ5HnLYb4Aa5yzRfAbZLfSw/', icon: 'youtube' },
  { id: 'soc-5', text: 'Twitter', type: 'social', width: 70, bg: 'transparent', textCol: '#1DA1F2', url: 'https://twitter.com/nalasbaby', icon: 'twitter' },

  { id: 'brand', text: 'NALA\'S BABY', type: 'brand', width: 240, bg: 'transparent', textCol: '#c1765b' },
  { id: 'news', text: 'NEWSLETTER', type: 'link', width: 200, bg: 'transparent', textCol: '#c1765b' },
];

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

const PhysicsFooter = () => {
  const location = useLocation();
  const containerRef = useRef(null);
  const itemsRef = useRef({});
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const [isPhysicsReady, setIsPhysicsReady] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

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

  // Reset animation when route changes
  useEffect(() => {
    // Clean up existing physics
    if (runnerRef.current && engineRef.current) {
      const Matter = window.Matter;
      if (Matter && Matter.Runner) {
        Matter.Runner.stop(runnerRef.current);
        Matter.World.clear(engineRef.current.world);
        Matter.Engine.clear(engineRef.current);
      }
    }

    // Reset state to allow animation to trigger again
    setHasTriggered(false);

    // Reset all item opacities
    Object.values(itemsRef.current).forEach(el => {
      if (el) {
        el.style.opacity = 0;
      }
    });
  }, [location.pathname]);

  const triggerDrop = () => {
    if (hasTriggered || !isPhysicsReady || !containerRef.current) return;
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

    // Create Item Bodies
    const itemBodies = FOOTER_ITEMS.map(item => {
        const x = Math.random() * (width - 100) + 50;
        const y = -Math.random() * 500 - 50; // Start above screen

        let body;
        if (item.type === 'social') {
             body = Bodies.circle(x, y, 30, {
                restitution: 0.5,
                friction: 0.1,
                render: { visible: false },
                label: item.id
            });
        } else {
            body = Bodies.rectangle(x, y, item.width, 50, {
                chamfer: { radius: 25 }, // Pill shape
                restitution: 0.5,
                friction: 0.1,
                render: { visible: false },
                label: item.id
            });
        }
        return body;
    });

    World.add(engine.world, [floor, leftWall, rightWall, ...itemBodies]);

    // Mouse/Touch Control
    const mouse = Mouse.create(containerRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.2,
            render: { visible: false }
        }
    });

    // Allow scrolling when not dragging - remove default scroll blocking
    mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);

    // On mobile, only prevent scroll when actually dragging an item
    if (window.innerWidth < 768) {
      let isDragging = false;

      mouseConstraint.body = null; // Start with no body selected

      // Track when user starts dragging
      containerRef.current.addEventListener('touchstart', (e) => {
        // Check if touch is on an item (not background)
        const touch = e.touches[0];
        const bodies = itemBodies;
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        // Simple check if we're touching an item
        isDragging = true;
      }, { passive: true });

      containerRef.current.addEventListener('touchend', () => {
        isDragging = false;
      }, { passive: true });
    }

    World.add(engine.world, mouseConstraint);

    // Runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Render Loop using requestAnimationFrame for smooth DOM syncing
    const updateLoop = () => {
        if (!containerRef.current) return;

        itemBodies.forEach((body, index) => {
            const item = FOOTER_ITEMS[index];
            const domEl = itemsRef.current[item.id];

            if (domEl) {
                const { x, y } = body.position;
                const angle = body.angle;

                // Sync DOM to Physics
                domEl.style.transform = `translate(${x - (item.width || 60)/2}px, ${y - (item.type === 'social' ? 30 : 25)}px) rotate(${angle}rad)`;

                // Show element once it falls into view approx
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
    <footer
        ref={containerRef}
        className="relative bg-[#ffeddb] text-[#333333] min-h-[600px] overflow-hidden cursor-default select-none"
        onMouseEnter={() => {
            triggerDrop();
        }}
    >
        {/* Instruction Overlay - Disappears on trigger */}
        {!hasTriggered && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="text-center">
                    <ArrowDown size={64} className="animate-bounce mx-auto mb-4 opacity-30 text-[#c1765b]" />
                    <p className="font-bold text-2xl uppercase opacity-30 tracking-widest text-[#c1765b]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      <span className="md:hidden">Tap to Explore</span>
                      <span className="hidden md:inline">Hover to Explore</span>
                    </p>
                 </div>
            </div>
        )}

        {/* Faded Logo with Promotion Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
          <img
            src="/nala-2.png"
            alt="Nala's Baby Logo"
            className="h-32 md:h-48 w-auto opacity-20"
          />
          <p className="text-xl md:text-2xl font-black uppercase tracking-tight mt-4 opacity-20 text-[#c1765b]" style={{ fontFamily: 'Inter, sans-serif' }}>
            33% off Everything
          </p>
        </div>

        {/* DOM Elements for Physics */}
        {FOOTER_ITEMS.map(item => {
            const renderContent = () => {
                if (item.type === 'social') {
                    // Render icon for social items with brand colors using Font Awesome
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
                }
                return item.text;
            };

            const itemElement = (
                <div
                    key={item.id}
                    ref={el => itemsRef.current[item.id] = el}
                    className={`absolute top-0 left-0 flex items-center justify-center font-black uppercase hover:cursor-grab active:cursor-grabbing z-20 transition-opacity duration-300`}
                    style={{
                        width: item.type === 'social' ? item.width : item.width,
                        height: item.type === 'social' ? item.width : 60,
                        borderRadius: '0',
                        backgroundColor: 'transparent',
                        color: item.textCol,
                        opacity: 0,
                        willChange: 'transform',
                        fontFamily: item.type === 'social' ? 'inherit' : 'Inter, sans-serif',
                        fontSize: item.type === 'social' ? 'inherit' : '28px',
                        fontWeight: item.type === 'social' ? 'normal' : '900',
                        border: 'none',
                        boxShadow: 'none',
                        letterSpacing: '0.5px'
                    }}
                >
                    {item.url ? (
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {renderContent()}
                        </a>
                    ) : (
                        renderContent()
                    )}
                </div>
            );

            return itemElement;
        })}

    </footer>
  );
};

export default PhysicsFooter;
