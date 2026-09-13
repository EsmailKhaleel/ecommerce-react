import { motion } from "framer-motion"
import { staggerContainer, textVariant, fadeIn } from "../../utils/motion"
import { useState } from "react"
import { toast } from "react-toastify"
import { subscribeNewsletter, unsubscribeNewsletter } from "../../services/commerceService"

function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [busy, setBusy] = useState(false);
    const submit = async (event, unsubscribe = false) => {
        event.preventDefault();
        if (!email.trim() || busy) return;
        setBusy(true);
        try {
            await (unsubscribe ? unsubscribeNewsletter(email.trim()) : subscribeNewsletter(email.trim()));
            toast.success(unsubscribe ? 'You have been unsubscribed.' : 'Thanks for subscribing!');
            setEmail('');
        } catch (error) { toast.error(error.message); }
        finally { setBusy(false); }
    };
    return (
        <motion.section
            className="relative py-20 bg-primary/10 dark:bg-primary/5"
        >
            <div className="container mx-auto px-4">
                <motion.div
                    variants={staggerContainer(0.1, 0.1)}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: false, amount: 0.3 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    <motion.h2
                        variants={textVariant(0.2)}
                        className="text-4xl font-bold text-gray-900 dark:text-white mb-6"
                    >
                        Stay Updated
                    </motion.h2>
                    <motion.p
                        variants={fadeIn("up", "spring", 0.3, 1)}
                        className="text-lg text-gray-600 dark:text-gray-300 mb-8"
                    >
                        Subscribe to our newsletter for the latest updates and exclusive offers
                    </motion.p>
                    <motion.form
                        variants={fadeIn("up", "spring", 0.4, 1)}
                        className="flex gap-4 flex-wrap justify-center items-center"
                        onSubmit={submit}
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            required
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-3 rounded-full border-2 border-gray-200 dark:border-gray-700 focus:border-primary dark:focus:border-primary outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <motion.button
                            type="submit"
                            disabled={busy}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 bg-primary text-white rounded-full font-semibold"
                        >
                            {busy ? 'Please wait…' : 'Subscribe'}
                        </motion.button>
                        <button type="button" disabled={busy || !email} onClick={event => submit(event, true)} className="text-sm text-gray-600 dark:text-gray-300 underline disabled:opacity-50">Unsubscribe</button>
                    </motion.form>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default NewsletterSection
