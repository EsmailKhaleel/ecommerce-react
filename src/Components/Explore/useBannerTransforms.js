import { useScroll, useTransform } from "framer-motion";

export function useBannerTransforms() {
    const { scrollYProgress } = useScroll();

  return {
    firstBanner: {
      y: useTransform(scrollYProgress, [0.3, 0.6], [200, 0]),
      scale: useTransform(scrollYProgress, [0.3, 0.6], [1.1, 1]),
      filter: useTransform(scrollYProgress, [0.3, 0.45, 0.6], ["brightness(50%)", "brightness(80%)", "brightness(100%)"])
    },
    thirdBannerleft: {
      scale: useTransform(scrollYProgress, [0.5, 1], [0.9, 1.1]),
      rotate: useTransform(scrollYProgress, [0.5, 1], [-5, 5]),
      opacity: useTransform(scrollYProgress, [0.5, 0.8, 1], [0.7, 1, 0.9])
    },
    thirdBannerRight: {
      scale: useTransform(scrollYProgress, [0.5, 1], [0.9, 1.1]),
      rotate: useTransform(scrollYProgress, [0.5, 1], [5, -5]),
      opacity: useTransform(scrollYProgress, [0.5, 0.8, 1], [0.7, 1, 0.9])
    }
  };
}
