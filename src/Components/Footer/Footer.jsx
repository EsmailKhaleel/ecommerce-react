import { useRef } from "react";
import { Link } from "react-router-dom";
import { BiArrowToRight } from "react-icons/bi";
import { motion, useScroll, useTransform } from "framer-motion";
import footerFold from "../../assets/footer-fold.png";

function Footer() {
  const footerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ["start end", "end end"] });
  const artworkY = useTransform(scrollYProgress, [0, 1], [150, -24]);
  const artworkRotate = useTransform(scrollYProgress, [0, 1], [4, 0]);

  return (
    <footer className="editorial-footer" ref={footerRef}>
      <motion.img className="footer-artwork" src={footerFold} alt="" aria-hidden="true" style={{ y: artworkY, rotate: artworkRotate }} />
      <div className="footer-topline"><span>ShopSphere®</span><span>Est. 2025 · Cairo</span></div>
      <div className="footer-main">
        <p>Good things,<br /><em>well chosen.</em></p>
        <div className="footer-links">
          <Link to="/products">Shop all</Link><Link to="/about">Our story</Link><Link to="/wishlist">Wishlist</Link><Link to="/account">Account</Link>
        </div>
      </div>
      <Link className="footer-cta" to="/products"><span>Start exploring</span><BiArrowToRight aria-hidden="true" /></Link>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} ShopSphere</span><span>Curated for everyday life.</span></div>
    </footer>
  );
}

export default Footer;
