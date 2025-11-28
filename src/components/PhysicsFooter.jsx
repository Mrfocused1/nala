import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';

// Footer items adapted for Nala's Baby
const FOOTER_ITEMS = [
  { id: 'shop-1', text: 'Body Wash', type: 'link', width: 140, bg: '#c1765b', textCol: '#ffffff' },
  { id: 'shop-2', text: 'Lotions', type: 'link', width: 120, bg: '#c1765b', textCol: '#ffffff' },
  { id: 'shop-3', text: 'Hair Care', type: 'link', width: 130, bg: '#ffffff', textCol: '#c1765b' },
  { id: 'shop-4', text: 'Bundles', type: 'link', width: 120, bg: '#ffffff', textCol: '#c1765b' },

  { id: 'help-1', text: 'Shipping', type: 'link', width: 120, bg: '#c1765b', textCol: '#ffffff' },
  { id: 'help-2', text: 'Returns', type: 'link', width: 110, bg: '#ffffff', textCol: '#c1765b' },
  { id: 'help-3', text: 'FAQ', type: 'link', width: 80, bg: '#c1765b', textCol: '#ffffff' },
  { id: 'help-4', text: 'Contact', type: 'link', width: 120, bg: '#ffffff', textCol: '#c1765b' },

  { id: 'soc-1', text: 'IG', type: 'social', width: 60, bg: '#ffffff', textCol: '#c1765b' },
  { id: 'soc-2', text: 'TK', type: 'social', width: 60, bg: '#c1765b', textCol: '#ffffff' },
  { id: 'soc-3', text: 'FB', type: 'social', width: 60, bg: '#ffffff', textCol: '#c1765b' },
  { id: 'soc-4', text: 'YT', type: 'social', width: 60, bg: '#c1765b', textCol: '#ffffff' },

  { id: 'brand', text: 'NALA\'S BABY', type: 'brand', width: 200, bg: '#ffffff', textCol: '#c1765b' },
  { id: 'news', text: 'NEWSLETTER', type: 'link', width: 160, bg: '#c1765b', textCol: '#ffffff' },
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

        {/* DOM Elements for Physics */}
        {FOOTER_ITEMS.map(item => (
            <div
                key={item.id}
                ref={el => itemsRef.current[item.id] = el}
                className={`absolute top-0 left-0 flex items-center justify-center font-bold uppercase text-sm shadow-lg hover:cursor-grab active:cursor-grabbing z-20 transition-opacity duration-300`}
                style={{
                    width: item.width || 60,
                    height: item.type === 'social' ? 60 : 50,
                    borderRadius: item.type === 'social' ? '50%' : '25px',
                    backgroundColor: item.bg,
                    color: item.textCol,
                    opacity: 0,
                    willChange: 'transform',
                    fontFamily: 'Montserrat, sans-serif',
                    border: item.bg === '#ffffff' ? '3px solid #c1765b' : '3px solid #ffffff',
                    boxShadow: '0 4px 15px rgba(193, 118, 91, 0.15)'
                }}
            >
                {item.text}
            </div>
        ))}

    </footer>
  );
};

export default PhysicsFooter;
