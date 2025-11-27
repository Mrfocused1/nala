import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import BurgerMenu from './BurgerMenu';

// --- Data & Content ---

const PRODUCT = {
  title: "Gentle Baby Wash",
  price: 24.00,
  currency: "USD",
  installments: "Pay in full or in 4 interest-free installments of $6.00.",
  sizes: ["100ml", "250ml", "500ml"],
  description: "Our signature baby wash is lovingly crafted with natural ingredients to cleanse and nourish your baby's delicate skin. Gentle enough for newborns, perfect for toddlers.",
  shippingNote: "Note: Your order will ship within 1-2 weeks of purchase. Free shipping on orders over $50.",
  details: "Our Gentle Baby Wash is crafted with care using only the finest natural ingredients. Dermatologically tested and approved for sensitive skin. Free from harsh chemicals, parabens, and sulfates.",
  materials: [
    "Made with 100% natural ingredients.",
    "Dermatologically tested.",
    "Free from parabens and sulfates.",
    "Vegan and cruelty-free.",
    "Recyclable packaging.",
    "Made in the UK."
  ],
  sizeChart: {
    columns: ["Size", "Volume", "Uses (approx)", "Price per ml"],
    rows: [
      ["Travel", "100ml", "20 baths", "$0.24"],
      ["Standard", "250ml", "50 baths", "$0.18"],
      ["Family", "500ml", "100 baths", "$0.15"]
    ]
  }
};

const RELATED_PRODUCTS = [
  { id: 1, name: "Soothing Baby Lotion", price: 22, img: "/products/product2.png" },
  { id: 2, name: "Gentle Shampoo", price: 20, img: "/products/product3.png" },
  { id: 3, name: "Baby Care Bundle", price: 59, img: "/products/product1.png" },
];

const IMAGES = [
  "/products/product1.png",
  "/products/product2.png",
  "/products/product3.png",
  "/products/product4.png",
  "/products/product1.png",
  "/products/product2.png"
];

// --- Components ---

const AccordionItem = ({ title, children, isOpen, onClick }) => (
  <div className="border-t border-gray-300">
    <button
      onClick={onClick}
      className="flex justify-between items-center w-full py-4 text-left group hover:text-[#c1765b] transition-colors"
    >
      <span className="font-medium text-lg">{title}</span>
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
    >
      <div className="text-gray-600 leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

const SizeTable = ({ data }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead>
        <tr className="border-b border-gray-200">
          {data.columns.map((col, i) => (
            <th key={i} className={`py-2 px-2 font-semibold ${i === 0 ? 'pl-0' : 'text-center'}`}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, i) => (
          <tr key={i} className="border-b border-gray-100">
            {row.map((cell, j) => (
              <td key={j} className={`py-2 px-2 ${j === 0 ? 'pl-0 font-medium' : 'text-center text-gray-600'}`}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function ProductPage() {
  const [selectedSize, setSelectedSize] = useState('250ml');
  const [openAccordion, setOpenAccordion] = useState('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleAccordion = (key) => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-[#fff5eb] font-sans text-[#333333] selection:bg-[#c1765b]/20 selection:text-[#c1765b]">

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-40 pointer-events-none bg-[#fff5eb]/95 backdrop-blur-sm">
        {/* Center: Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[20px] pointer-events-auto">
          <Link to="/">
            <img
              src="/nala-2.png"
              alt="Nala's Baby Logo"
              className="h-16 md:h-20 w-auto drop-shadow-lg hover:scale-105 transition-transform cursor-pointer"
            />
          </Link>
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
                className="text-xl md:text-2xl italic font-light tracking-wide transition-colors text-[#c1765b] hover:text-[#333333]"
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
                  stroke="#c1765b"
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

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row">

          {/* Left: Image Gallery */}
          <div className="w-full md:w-3/5 lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2">
              {IMAGES.map((img, index) => (
                <div key={index} className={`relative aspect-[4/5] bg-[#ffeddb] overflow-hidden ${index % 3 === 0 ? 'md:col-span-2' : ''}`}>
                  <img
                    src={img}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Details (Sticky) */}
          <div className="w-full md:w-2/5 lg:w-1/3 px-4 md:px-12 py-8 md:py-12 md:sticky md:top-0 md:h-screen md:overflow-y-auto hide-scrollbar">

            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
              {PRODUCT.title}
            </h1>

            <div className="text-xl md:text-2xl mb-2 font-medium text-[#c1765b]">
              ${PRODUCT.price.toFixed(2)} {PRODUCT.currency}
            </div>

            <p className="text-sm text-gray-500 mb-8">
              {PRODUCT.installments}
            </p>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex justify-between mb-3">
                <span className="text-sm font-semibold uppercase tracking-wide">Size: {selectedSize}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {PRODUCT.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      px-6 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                      ${selectedSize === size
                        ? 'bg-[#c1765b] text-white shadow-lg transform scale-105'
                        : 'bg-white border-2 border-[#333333] text-[#333333] hover:border-[#c1765b]'}
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full bg-[#333333] text-white py-4 px-6 rounded-md font-bold text-lg hover:bg-[#c1765b] transition-colors mb-12 flex items-center justify-center gap-2 group">
              Add to cart
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Accordions */}
            <div className="space-y-2">
              <AccordionItem
                title="Overview"
                isOpen={openAccordion === 'overview'}
                onClick={() => toggleAccordion('overview')}
              >
                <p className="mb-4">{PRODUCT.description}</p>
                <p className="text-sm text-gray-500 italic">{PRODUCT.shippingNote}</p>
              </AccordionItem>

              <AccordionItem
                title="Details"
                isOpen={openAccordion === 'details'}
                onClick={() => toggleAccordion('details')}
              >
                <p>{PRODUCT.details}</p>
              </AccordionItem>

              <AccordionItem
                title="Ingredients and care"
                isOpen={openAccordion === 'materials'}
                onClick={() => toggleAccordion('materials')}
              >
                <ul className="list-disc list-inside space-y-1">
                  {PRODUCT.materials.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </AccordionItem>

              <AccordionItem
                title="Size guide"
                isOpen={openAccordion === 'fit'}
                onClick={() => toggleAccordion('fit')}
              >
                <p className="mb-4 font-medium">Choose the perfect size for your family.</p>
                <SizeTable data={PRODUCT.sizeChart} />
              </AccordionItem>
            </div>

          </div>
        </div>

        {/* You May Also Like Section */}
        <section className="py-16 px-4 md:px-8 border-t-4 border-[#c1765b] mt-8 bg-[#ffeddb]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>You may also like</h2>
            <a href="#" className="text-sm underline hover:text-[#c1765b] transition-colors">View all</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {RELATED_PRODUCTS.map((prod) => (
              <div key={prod.id} className="group cursor-pointer">
                <div className="bg-white aspect-square mb-4 overflow-hidden relative border-2 border-[#333333]">
                  <img
                    src={prod.img}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-[#c1765b]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold text-lg">{prod.name}</h3>
                <p className="text-[#c1765b] font-medium">${prod.price}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
