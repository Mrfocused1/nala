"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * ASSETS & STYLES
 * Using Google Fonts via style injection for the specific "Nala's Baby" look.
 */
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');
  `}</style>
);

/**
 * MANIFESTO
 * The big text with the circled "young" animation.
 */
const Manifesto = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div className="flex justify-center items-center h-full px-6 py-12 md:py-0">
      <div className="max-w-2xl">
        <h1
          ref={ref}
          className="text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-[#333333]"
        >
          <span className="font-sans font-bold">we believe in </span>
          <span className="relative inline-block mx-1">
            <span className="font-sans font-bold">gentle</span>
            {/* Hand-drawn circle SVG */}
            <svg
              className="absolute -top-4 -left-6 w-[140%] h-[150%] pointer-events-none text-[#c1765b]"
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
          <span className="font-sans font-bold">, </span>
          <span className="relative inline-block mx-1">
            <span className="italic font-light tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>natural</span>
            {/* Hand-drawn wavy underline SVG */}
            <svg
              className="absolute -bottom-2 left-0 w-full h-6 pointer-events-none text-[#c1765b]"
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
          </span>
          <span className="font-sans font-bold"> skincare for the most delicate skin</span>
        </h1>
      </div>
    </div>
  );
};

export default function CloudWatchForm() {
  const [isTyping, setIsTyping] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    const offsetX = ((cursor.x / window.innerWidth) - 0.5) * 40; // bigger range
    const offsetY = ((cursor.y / window.innerHeight) - 0.5) * 20;
    setEyePos({ x: offsetX, y: offsetY });
  }, [cursor]);

  // Blinking every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 md:p-8">
      <FontStyles />

      {/* Two-Column Layout */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

        {/* LEFT SIDE: Manifesto */}
        <div className="flex items-center justify-center">
          <Manifesto />
        </div>

        {/* RIGHT SIDE: Contact Form */}
        <div className="flex items-center justify-center">
          <div className="bg-[#fff5eb]/90 backdrop-blur-md rounded-2xl shadow-2xl p-12 flex flex-col items-center gap-8 w-full max-w-lg border-2 border-[#c1765b]/20">

        {/* Cartoon Face */}
          <div className="relative w-70 h-40">
            <div className="absolute inset-0 bg-[#fff5eb] rounded-lg"></div>
            <img
              src="https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/cloud.jpg"
              alt="cartoon"
              className="w-full h-full relative mix-blend-multiply opacity-80"
            />

            {["left", "right"].map((side, idx) => (
              <div
                key={side}
                className="absolute flex justify-center items-end overflow-hidden"
                style={{
                  top: 60,
                  left: idx === 0 ? 80 : 150,
                  width: 28,
                  height: isTyping
                    ? 4 // fully closed when typing password
                    : blink
                    ? 6 // temporary blink
                    : 40, // open eye
                  borderRadius: isTyping || blink ? "2px" : "50% / 60%",
                  backgroundColor: isTyping ? "black" : "white", // black line when typing
                  transition: "all 0.15s ease",
                }}
              >
                {!isTyping && (
                  <div
                    className="bg-black"
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      marginBottom: 4, // pupil at bottom
                      transform: `translate(${eyePos.x}px, 0px)`,
                      transition: "all 0.1s ease",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

        {/* Form */}
        <div className="w-full flex flex-col gap-5">
          <div className="flex flex-col">
            <Label>Name</Label>
            <Input placeholder="Your Name" />
          </div>
          <div className="flex flex-col">
            <Label>Email</Label>
            <Input type="email" placeholder="Your Email" />
          </div>
          <div className="flex flex-col">
            <Label>Username</Label>
            <Input placeholder="Username" />
          </div>
          <div className="flex flex-col">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Password"
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
            />
          </div>
          <Button className="mt-4">Submit</Button>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
