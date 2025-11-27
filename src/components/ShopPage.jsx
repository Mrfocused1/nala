import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import BurgerMenu from './BurgerMenu';

const products = [
  {
    id: 1,
    name: 'Original Adventure Bundle',
    price: '£45.00',
    image: '/products/product1.png',
    category: 'bundles',
    tag: 'Bestseller'
  },
  {
    id: 2,
    name: 'Luxury Gift Set',
    price: '£55.00',
    image: '/products/product2.png',
    category: 'bundles',
    tag: 'Gift'
  },
  {
    id: 3,
    name: 'Original Skin Trio',
    price: '£32.00',
    image: '/products/product3.png',
    category: 'skincare',
    tag: 'New'
  },
  {
    id: 4,
    name: 'Baby Wash Set',
    price: '£28.00',
    image: '/products/product4.png',
    category: 'wash',
    tag: null
  },
  {
    id: 5,
    name: 'Gentle Body Wash',
    price: '£12.00',
    image: '/products/product1.png',
    category: 'wash',
    tag: 'Bestseller'
  },
  {
    id: 6,
    name: 'Nourishing Lotion',
    price: '£14.00',
    image: '/products/product2.png',
    category: 'skincare',
    tag: null
  },
  {
    id: 7,
    name: 'Soothing Cream',
    price: '£16.00',
    image: '/products/product3.png',
    category: 'skincare',
    tag: 'New'
  },
  {
    id: 8,
    name: 'Baby Shampoo',
    price: '£11.00',
    image: '/products/product4.png',
    category: 'hair',
    tag: null
  },
];

const ShopPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'bundles', name: 'Bundles' },
    { id: 'skincare', name: 'Skincare' },
    { id: 'wash', name: 'Body Wash' },
    { id: 'hair', name: 'Hair Care' },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="w-full min-h-screen bg-[#fff5eb] text-[#333333] font-sans overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-40 pointer-events-none">
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

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex flex-col items-center justify-center pt-40 pb-20 px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#333333] tracking-tighter mb-8 leading-none">
            SHOP <span className="italic font-light tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>COLLECTION</span>
          </h1>
          <p className="text-base md:text-lg text-[#6c757d] max-w-xl mx-auto leading-relaxed px-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Naturally derived, paediatrician approved skincare for your little ones.
          </p>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="px-8 md:px-20 mb-16">
        <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-8 py-3 font-bold uppercase text-xs tracking-widest transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-[#c1765b] text-white shadow-lg scale-105 border-2 border-[#c1765b]'
                  : 'bg-white text-[#c1765b] border-2 border-[#c1765b] hover:bg-[#c1765b] hover:text-white'
              }`}
              style={{ fontFamily: 'Montserrat, sans-serif', borderRadius: '4px' }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-8 md:px-20 pb-32">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          layout
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              layout
            >
              <Link to={`/shop/${product.id}`}>
                <div className="group relative bg-white rounded-2xl overflow-hidden border-2 border-[#c1765b]/10 hover:border-[#c1765b] transition-all duration-300 hover:shadow-2xl cursor-pointer">
                  {/* Product Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#fff5eb]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Tag */}
                    {product.tag && (
                      <div className="absolute top-4 right-4 bg-[#c1765b] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
                        {product.tag}
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="bg-white p-3 rounded-full shadow-lg hover:bg-[#c1765b] hover:text-white transition-colors">
                        <Heart size={20} />
                      </button>
                      <button className="bg-[#c1765b] text-white p-3 rounded-full shadow-lg hover:bg-[#a0624a] transition-colors">
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#333333] mb-2 group-hover:text-[#c1765b] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-black text-[#c1765b]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {product.price}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default ShopPage;
