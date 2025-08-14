import { motion } from "framer-motion";

const shimmerAnimation = {
  initial: { opacity: 0.6 },
  animate: { opacity: 1 },
  transition: { repeat: Infinity, repeatType: "reverse", duration: 0.8 }
};

export default function ProductDetailsSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Side: Image Gallery */}
      <div className="flex flex-row-reverse gap-4 lg:w-1/2">
        {/* Main Image */}
        <motion.div
          {...shimmerAnimation}
          className="w-full h-[500px] bg-gray-200 dark:bg-gray-700 rounded-xl"
        />

        {/* Thumbnails */}
        <div className="flex flex-col gap-3">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <motion.div
                key={i}
                {...shimmerAnimation}
                transition={{
                  ...shimmerAnimation.transition,
                  delay: i * 0.1
                }}
                className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            ))}
        </div>
      </div>

      {/* Right Side: Content */}
      <div className="flex-1 space-y-6">
        {/* Title */}
        <motion.div
          {...shimmerAnimation}
          className="w-3/4 h-8 bg-gray-200 dark:bg-gray-700 rounded"
        />

        {/* Price */}
        <motion.div
          {...shimmerAnimation}
          className="w-32 h-6 bg-gray-200 dark:bg-gray-700 rounded"
        />

        {/* Actions Section */}
        <div className="space-y-4">
          {/* First row of buttons */}
          <div className="grid grid-cols-2 gap-2">
            <motion.div
              {...shimmerAnimation}
              className="h-12 bg-gray-200 dark:bg-gray-700 rounded"
            />
            <motion.div
              {...shimmerAnimation}
              className="h-12 bg-gray-200 dark:bg-gray-700 rounded"
            />
          </div>

          {/* Second row of buttons */}
          <div className="grid grid-cols-2 gap-2">
            <motion.div
              {...shimmerAnimation}
              className="h-10 bg-gray-200 dark:bg-gray-700 rounded"
            />
            <motion.div
              {...shimmerAnimation}
              className="h-10 bg-gray-200 dark:bg-gray-700 rounded"
            />
          </div>
        </div>

        {/* Shipping & Benefits */}
        <div className="sm:flex sm:justify-between sm:gap-3 space-y-3 py-4 border-t border-gray-200 dark:border-gray-700">
          {Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <motion.div
                  {...shimmerAnimation}
                  className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"
                />
                <div>
                  <motion.div
                    {...shimmerAnimation}
                    className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"
                  />
                  <motion.div
                    {...shimmerAnimation}
                    className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded mt-1"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
