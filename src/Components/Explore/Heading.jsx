import { motion } from "framer-motion"

function Heading() {
    return (
        <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            <h1 className="text-5xl md:text-6xl font-bold text-neutral dark:text-neutral-light mb-4 tracking-tight">
                Explore Our Collections
            </h1>
            <p className="text-xl text-neutral/70 dark:text-neutral-light/70 max-w-2xl mx-auto">
                Discover amazing products across different categories
            </p>
        </motion.div>
    )
}

export default Heading