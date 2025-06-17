import { motion } from "framer-motion"
import { BiError } from "react-icons/bi"



export default function Error({ error  }) {
  return (
    <motion.div
                className="min-h-screen bg-background-light dark:bg-neutral-dark flex flex-col items-center justify-center px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="text-center max-w-md">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                    >
                        <BiError className="w-20 h-20 text-primary mx-auto mb-6" />
                    </motion.div>
                    <motion.h2
                        className="text-3xl font-bold text-neutral dark:text-neutral-light mb-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Oops! Something went wrong
                    </motion.h2>
                    <motion.p
                        className="text-neutral/70 dark:text-neutral-light/70 mb-8 leading-relaxed"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {error?.message || "Failed to load collections. Please check your connection and try again."}
                    </motion.p>
                    <motion.button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 bg-primary text-neutral-light rounded-full hover:bg-primary-dark transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Try Again
                    </motion.button>
                </div>
            </motion.div>
  )
}
