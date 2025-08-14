import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react";


function Expander({ title, details }) {
    const [isDetailsShown, setIsDetailsShown] = useState(false);
    return (
        <motion.section
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
        >
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6">
                <button
                    onClick={() => setIsDetailsShown(!isDetailsShown)}
                    className="w-full flex items-center justify-between text-left"
                >
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h2>
                    <motion.span
                        animate={{ rotate: isDetailsShown ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-gray-400"
                    >
                        ▼
                    </motion.span>
                </button>

                <AnimatePresence>
                    {isDetailsShown && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <p className="text-gray-600 dark:text-gray-100 leading-relaxed mt-3">
                                {details}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.section>
    )
}

export default Expander