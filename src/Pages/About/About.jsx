import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BiArrowToRight } from "react-icons/bi";

function About() {
  return (
    <main className="customer-page about-page">
      <section className="about-hero">
        <span>Our point of view</span>
        <motion.h1 initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
          A better shop starts<br />with <em>better choices.</em>
        </motion.h1>
      </section>
      <section className="about-story">
        <div><span>01 / Why</span><h2>Less noise.<br />More meaning.</h2></div>
        <div>
          <p>ShopSphere brings together useful, beautiful objects for everyday life. We prefer a thoughtful edit over an endless catalogue—so finding the right thing feels clear, calm, and satisfying.</p>
          <p>Across technology, home, style, beauty, fragrance, and food, every department follows the same idea: good design should earn its place in your life.</p>
          <Link to="/products">Explore the collection <BiArrowToRight /></Link>
        </div>
      </section>
      <section className="about-values">
        <div><span>01</span><h3>Useful</h3><p>Products chosen to work hard and live well.</p></div>
        <div><span>02</span><h3>Considered</h3><p>A focused selection, with less clutter between you and the right choice.</p></div>
        <div><span>03</span><h3>Human</h3><p>Straightforward service before, during, and after your order.</p></div>
      </section>
    </main>
  );
}

export default About;
