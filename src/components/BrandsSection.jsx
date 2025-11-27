import React, { useRef, useEffect } from 'react';

const LogoCard = ({ logo, index }) => (
  <div
    className="
      flex-shrink-0
      w-[200px] h-[150px]
      md:w-[260px] md:h-[190px]
      bg-transparent
      flex items-center justify-center
      p-8
      transition-all
      duration-300
    "
  >
    {/* Placeholder for the Logo Image */}
    <div className="w-full h-full flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100">
      {logo.src ? (
         <img src={logo.src} alt={logo.name} className="max-w-full max-h-full object-contain" />
      ) : (
        <span className="text-xl font-bold text-gray-400 text-center leading-tight">{logo.name}</span>
      )}
    </div>
  </div>
);

const BrandsSection = () => {
  const seenCirclePath = useRef(null);

  // Real media outlets that have featured Nala's Baby
  const logos = [
    { id: 1, name: "Sky News", src: "/media-logos/sky-news.svg" },
    { id: 2, name: "Evening Standard", src: "/media-logos/evening-standard.svg" },
    { id: 3, name: "BeautyMatter", src: "/media-logos/beautymatter.svg" },
    { id: 4, name: "Mother & Baby", src: "/media-logos/mother-and-baby.svg" },
    { id: 5, name: "Grazia", src: "/media-logos/grazia.svg" },
    { id: 6, name: "Voice Online", src: "/media-logos/voice-online.svg" },
    { id: 7, name: "GRM Daily", src: "/media-logos/grm-daily.svg" },
  ];

  // We duplicate the logos to create the seamless loop effect
  const duplicatedLogos = [...logos, ...logos, ...logos];

  useEffect(() => {
    // Check if gsap is available
    if (typeof window !== 'undefined' && window.gsap && seenCirclePath.current) {
      const path = seenCirclePath.current;
      const pathLength = path.getTotalLength();

      // Set initial state
      window.gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        opacity: 1
      });

      // Create intersection observer for animation on scroll
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              window.gsap.to(path, {
                strokeDashoffset: 0,
                duration: 0.8,
                ease: "power2.inOut",
                delay: 0.3
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      const heading = path.closest('h2');
      if (heading) {
        observer.observe(heading);
      }

      return () => observer.disconnect();
    }
  }, []);

  return (
    <div className="bg-[#ffeddb] font-sans flex flex-col">
      {/* Main Section */}
      <main className="flex items-center py-12 overflow-hidden">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: Heading */}
            <div className="lg:col-span-4 flex flex-col justify-center z-10 text-center lg:text-left" style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
              <h2 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[0.95] tracking-tight">
                As <span className="relative inline-block">
                  <span className="italic font-light tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>seen</span>
                  <svg
                    className="absolute -top-[20%] -left-[5%] w-[110%] h-[120%] pointer-events-none overflow-visible"
                    viewBox="0 0 200 100"
                  >
                    <path
                      ref={seenCirclePath}
                      d="M 20 40 C 20 20, 80 10, 150 20 C 200 30, 190 80, 140 85 C 90 90, 30 80, 25 50"
                      fill="none"
                      stroke="#c1765b"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="opacity-0"
                    />
                  </svg>
                </span> <br />
                in
              </h2>
            </div>

            {/* Right Column: Marquee */}
            {/* The mask-image creates the fade effect on the edges */}
            <div className="lg:col-span-8 relative">

              {/* Fade Gradients for visual polish (left and right edges) */}
              <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#ffeddb] to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#ffeddb] to-transparent pointer-events-none"></div>

              <div className="w-full overflow-hidden group">
                {/* The Scroll Container
                  - We translate X by -50% because the list is tripled/doubled.
                  - Duration is set to 40s for smooth slow movement.
                  - Pauses on hover.
                */}
                <div
                  className="flex space-x-6 w-max animate-scroll hover:[animation-play-state:paused]"
                >
                  {duplicatedLogos.map((logo, idx) => (
                    <LogoCard key={`${logo.id}-${idx}`} logo={logo} />
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Tailwind Custom Styles for Animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%); /* Move 1/3rd because we tripled the list */
          }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BrandsSection;
