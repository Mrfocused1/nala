import React from 'react';
import { motion } from 'framer-motion';

const ShopPage = () => {
  const products = [
    {
      id: 1,
      name: "Truus Tote Bag",
      price: "$45",
      image: "https://picsum.photos/seed/product1/400/500",
    },
    {
      id: 2,
      name: "Brand Hoodie",
      price: "$85",
      image: "https://picsum.photos/seed/product2/400/500",
    },
    {
      id: 3,
      name: "Logo T-Shirt",
      price: "$35",
      image: "https://picsum.photos/seed/product3/400/500",
    },
    {
      id: 4,
      name: "Truus Cap",
      price: "$28",
      image: "https://picsum.photos/seed/product4/400/500",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white py-32 px-8 md:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-black mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
            Shop
          </h1>
          <p className="text-xl text-white/60" style={{ fontFamily: 'Playfair Display, serif' }}>
            Exclusive merch for the new mainstream
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[4/5] bg-neutral-900">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                <p className="text-white/60 font-mono">{product.price}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-20"
        >
          <div className="inline-block bg-white/5 backdrop-blur-sm px-8 py-4 rounded-full border border-white/10">
            <p className="text-white/40 font-mono text-sm uppercase tracking-wider">
              More products coming soon
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ShopPage;
