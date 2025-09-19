import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../StateManagement/Slices/ProductsSlice';

export const ProductGridSections = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);

  useEffect(() => {
    dispatch(fetchProducts({
      page: 1,
      limit: 24,
      _sort: "createdAt",
      _order: "desc"
    }));
  }, [dispatch]);

  if (!products?.length) return null;

  const featuredProducts = products.slice(0, 8);
  const bannerProducts = products.slice(8, 14);

  return (
    <div className="bg-gray-100 dark:bg-neutral-dark">
      <section className="w-full grid grid-cols-1 md:grid-cols-12 gap-3 py-12">
        {featuredProducts.map((product, index) => (
          <motion.div
            key={product._id}
            className={`relative overflow-hidden rounded-xl ${
              index === 0 ? 'md:col-span-6 md:row-span-2 h-[600px]' : 
              index === 1 ? 'md:col-span-3 h-[290px]' :
              index === 2 ? 'md:col-span-3 h-[290px]' :
              index === 3 ? 'md:col-span-3 h-[290px]' :
              index === 4 ? 'md:col-span-3 h-[290px]' :
              index === 5 ? 'md:col-span-4 h-[320px]' :
              index === 6 ? 'md:col-span-4 h-[320px]' :
              'md:col-span-4 h-[320px]'
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div 
              className="relative w-full h-full group cursor-pointer"
              style={{ backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                <span className="inline-block bg-white/90 px-4 py-2 rounded-full text-sm capitalize shadow-lg">
                  {product.category}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-12 gap-3 py-16 px-4">
        {bannerProducts.map((product, index) => (
          <motion.div
            key={product._id}
            className={`relative rounded-xl overflow-hidden group cursor-pointer ${
              index === 0 ? 'md:col-span-8 h-[500px]' :
              index === 1 ? 'md:col-span-4 h-[500px]' :
              index === 2 ? 'md:col-span-4 h-[400px]' :
              index === 3 ? 'md:col-span-4 h-[400px]' :
              index === 4 ? 'md:col-span-4 h-[400px]' :
              'md:col-span-12 h-[300px]'
            }`}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700"
              style={{ backgroundImage: `url(${product.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="absolute bottom-8 left-8 text-white text-lg uppercase tracking-wider font-medium">
                {product.category}
              </span>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};