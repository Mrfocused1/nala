import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import BurgerMenu from './BurgerMenu';
import PhysicsFooter from './PhysicsFooter';

const products = [
  {
    id: 1,
    name: 'Original Adventure Bundle (6x 200ml)',
    price: '£32.99',
    image: '/products/product1.png',
    category: 'bundles',
    tag: 'Bestseller'
  },
  {
    id: 2,
    name: 'Luxury Gift Set (6x 200ml)',
    price: '£54.99',
    image: '/products/product2.png',
    category: 'bundles',
    tag: 'Gift'
  },
  {
    id: 3,
    name: 'Vanilla Cloud Body Butter 200ml',
    price: '£6.75',
    image: '/products/product3.png',
    category: 'skincare',
    tag: 'Bestseller'
  },
  {
    id: 4,
    name: 'Original Body Butter 200ml',
    price: '£6.50',
    image: '/products/product4.png',
    category: 'skincare',
    tag: null
  },
  {
    id: 5,
    name: 'Vanilla Cloud Body Wash & Shampoo 200ml',
    price: '£5.75',
    image: '/products/product5.png',
    category: 'wash',
    tag: null
  },
  {
    id: 6,
    name: 'Original Body Wash & Shampoo 200ml',
    price: '£5.55',
    image: '/products/product6.png',
    category: 'wash',
    tag: null
  },
  {
    id: 7,
    name: 'Vanilla Cloud Body Lotion 200ml',
    price: '£5.75',
    image: '/products/product7.png',
    category: 'skincare',
    tag: null
  },
  {
    id: 8,
    name: 'Vanilla Cloud Nighttime Oil 200ml',
    price: '£5.75',
    image: '/products/product8.png',
    category: 'skincare',
    tag: 'New'
  },
  {
    id: 9,
    name: 'Original Hair Conditioner 200ml',
    price: '£5.55',
    image: '/products/product9.png',
    category: 'hair',
    tag: null
  },
  {
    id: 10,
    name: 'Vanilla Cloud Bubble Bath 200ml',
    price: '£5.75',
    image: '/products/product10.png',
    category: 'wash',
    tag: null
  },
  {
    id: 11,
    name: 'Body Butter Duo 2 x 200ml',
    price: '£12.95',
    image: '/products/product11.png',
    category: 'bundles',
    tag: null
  },
  {
    id: 12,
    name: 'Vanilla Cloud Soft Skin Duo',
    price: '£13.99',
    image: '/products/product12.png',
    category: 'bundles',
    tag: null
  },
  {
    id: 13,
    name: 'Vanilla Cloud Complete Bundle (5x 200ml)',
    price: '£27.00',
    image: '/products/product13.png',
    category: 'bundles',
    tag: 'Bestseller'
  },
  {
    id: 14,
    name: 'Vanilla Cloud Mixed Bundle (3x 200ml)',
    price: '£16.00',
    image: '/products/product14.png',
    category: 'bundles',
    tag: null
  },
  {
    id: 15,
    name: 'Ice Cream Sundae Bundle',
    price: '£10.95',
    image: '/products/product15.png',
    category: 'bundles',
    tag: null
  },
  {
    id: 16,
    name: 'Strawberry Springs Trio',
    price: '£17.99',
    image: '/products/product16.png',
    category: 'bundles',
    tag: null
  },
  {
    id: 17,
    name: 'Sleep Trio',
    price: '£17.99',
    image: '/products/product17.png',
    category: 'bundles',
    tag: null
  },
  {
    id: 18,
    name: 'Original Skin Trio (3x 200ml)',
    price: '£18.99',
    image: '/products/product18.png',
    category: 'bundles',
    tag: null
  },
  {
    id: 19,
    name: 'Fragrance Free Body Lotion 200ml',
    price: '£5.75',
    image: '/products/product19.png',
    category: 'skincare',
    tag: null
  },
  {
    id: 20,
    name: 'Fragrance Free Body Wash 200ml',
    price: '£5.55',
    image: '/products/product20.png',
    category: 'wash',
    tag: null
  },
];

const ShopPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'bundles', name: 'Bundles' },
    { id: 'skincare', name: 'Skincare' },
    { id: 'wash', name: 'Body Wash' },
    { id: 'hair', name: 'Hair Care' },
  ];

  const filteredProducts = products
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#333333] tracking-tighter mb-8 leading-none text-center">
            SHOP <span className="italic font-light tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>COLLECTION</span>
          </h1>
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
                  ? 'bg-[#c1765b] text-white shadow-lg scale-105 border-2 border-[#333333]'
                  : 'bg-white text-[#c1765b] border-2 border-[#333333] hover:bg-[#c1765b] hover:text-white'
              }`}
              style={{ fontFamily: 'Inter, sans-serif', borderRadius: '4px' }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mt-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-6 py-3 border-2 border-[#333333] bg-white text-[#333333] placeholder-[#999999] font-bold uppercase text-xs tracking-widest focus:outline-none focus:ring-2 focus:ring-[#c1765b] transition-all"
            style={{ fontFamily: 'Inter, sans-serif', borderRadius: '4px' }}
          />
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-8 md:px-20 pb-32">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8"
          layout
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              layout
              className="group cursor-pointer"
            >
              <Link to={`/shop/${product.id}`}>
                {/* Product Card */}
                <div className="relative">
                  {/* Product Image Container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-white border-2 border-[#333333]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Hover Button */}
                    <div className="absolute inset-0 flex items-end justify-center pb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="bg-[#c1765b] text-white px-12 py-4 uppercase tracking-widest text-sm font-bold hover:bg-white hover:text-[#c1765b] border-2 border-[#c1765b] transition-all" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        ADD TO CART
                      </button>
                    </div>
                  </div>

                  {/* Product Info - Outside Card */}
                  <div className="mt-4">
                    <h3 className="text-[10px] md:text-xs font-sans font-bold text-[#333333] uppercase">
                      {product.name}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <PhysicsFooter />
    </div>
  );
};

export default ShopPage;
