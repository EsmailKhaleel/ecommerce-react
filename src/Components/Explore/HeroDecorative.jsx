import { motion } from "framer-motion"
import { presets } from "../../utils/motion"

function HeroDecorative() {
    return (
        <>
            <motion.div
                variants={presets.fadeRight}
                className="h-[300px] w-[300px] bg-primary/20 dark:bg-primary/10 absolute rotate-45 -top-32 -right-32 rounded-3xl z-0"
            ></motion.div>
            <motion.div
                variants={presets.fadeLeft}
                className="h-[200px] w-[200px] bg-secondary/20 dark:bg-secondary/10 absolute -rotate-12 -bottom-12 -left-12 rounded-full z-0"
            ></motion.div>
        </>
    )
}

export default HeroDecorative