/**
 * Common Motion Props Reference
 * 
 * Animation Props:
 * - initial: Starting state (e.g., { opacity: 0 })
 * - animate: Target state (e.g., { opacity: 1 })
 * - exit: State when component is removed (requires AnimatePresence)
 * - transition: Configuration object for animation timing
 *   {
 *     duration: number (seconds),
 *     delay: number (seconds),
 *     ease: string ("linear", "easeIn", "easeOut", "easeInOut"),
 *     type: string ("tween", "spring", "inertia")
 *   }
 */

export const navVariants = {
  hidden: {
    y: -50,
    opacity: 0
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1.25
    }
  }
};

export const slideIn = (direction, type, delay, duration) => ({
  hidden: {
    x: direction === "left" ? "-100%" : direction === "right" ? "100%" : 0,
    y: direction === "up" ? "100%" : direction === "down" ? "100%" : 0,
  },
  show: {
    x: 0,
    y: 0,
    transition: {
      type,
      delay,
      duration,
      ease: "easeOut",
    },
  },
});

export const staggerContainer = (staggerChildren, delayChildren) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const textVariant = (delay) => ({
  hidden: {
    y: 50,
    opacity: 0,
  },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1.25,
      delay,
    },
  },
});

export const fadeIn = (direction, type, delay, duration) => ({
  hidden: {
    x: direction === "left" ? 30 : direction === "right" ? -30 : 0,
    y: direction === "up" ? 30 : direction === "down" ? -30 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type,
      delay,
      duration,
      ease: "easeOut",
    },
  },
});

export const zoomIn = (delay, duration) => ({
  hidden: {
    scale: 0,
    opacity: 0,
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "tween",
      delay,
      duration,
      ease: "easeOut",
    },
  },
});

export const footerVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 140,
    },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      delay: 0.5,
    },
  },
};

export const staggerChildren = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const listItem = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

export const heroVariants = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      duration: 1.5,
    },
  },
};

export const presets = {
  fadeLeft: fadeIn("left", "spring", 0.6, 1.5),
  fadeRight: fadeIn("right", "spring", 1, 1.5),
  fadeUpDots: fadeIn("up", "spring", 1.2, 1.5),
  zoomPulse: zoomIn(0.8, 1),
};
