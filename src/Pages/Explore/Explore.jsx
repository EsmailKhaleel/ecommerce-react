import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { BiArrowFromLeft, BiArrowToRight } from "react-icons/bi";
import heroEditorial from "../../assets/hero-editorial.png";
import scrollStoryImage from "../../assets/scroll-story.png";
import campaignWide from "../../assets/campaign-wide.png";
import shapeRibbon from "../../assets/shape-ribbon.png";
import shapeInterlock from "../../assets/shape-interlock.png";
import shapeFold from "../../assets/shape-fold.png";
import landingHeadphones from "../../assets/landing-headphones.png";
import landingChair from "../../assets/landing-chair.png";
import landingSneakers from "../../assets/landing-sneakers.png";
import landingFragrance from "../../assets/landing-fragrance.png";
import "./explore.css";

const LANDING_PRODUCTS = [
  { id: "landing-headphones", name: "Halo Studio Headphones", category: "digital", price: 399, image: landingHeadphones },
  { id: "landing-chair", name: "Arc Lounge Chair", category: "furniture", price: 1395, image: landingChair },
  { id: "landing-sneakers", name: "Meridian Runner", category: "clothes", price: 150, image: landingSneakers },
  { id: "landing-fragrance", name: "Saffron No. 07", category: "fragrances", price: 165, image: landingFragrance },
];

const categories = ["digital", "clothes", "furniture", "beauty", "fragrances", "groceries"];
const reveal = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0 } };

function EditorialArrow() {
  return <BiArrowToRight aria-hidden="true" />;
}

function ShapeTransition() {
  const stageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });
  const interlockX = useTransform(scrollYProgress, [0, 0.7, 1], ["-10vw", "-34vw", "-42vw"]);
  const foldX = useTransform(scrollYProgress, [0, 0.7, 1], ["10vw", "34vw", "42vw"]);
  const interlockRotate = useTransform(scrollYProgress, [0, 1], [-7, -16]);
  const foldRotate = useTransform(scrollYProgress, [0, 1], [7, 16]);
  const shapeScale = useTransform(scrollYProgress, [0, 0.62, 1], [1.18, 0.88, 0.72]);
  const copyOpacity = useTransform(scrollYProgress, [0.18, 0.46, 0.82, 1], [0, 1, 1, 0]);
  const copyY = useTransform(scrollYProgress, [0.18, 0.48, 1], [80, 0, -70]);

  return (
    <section className="shape-transition" ref={stageRef} aria-labelledby="shape-title">
      <div className="shape-transition-sticky">
        <span className="shape-index">A study in form / 01</span>
        <motion.img
          className="shape-interlock"
          src={shapeInterlock}
          alt="Interlocking orange and teal sculptural forms"
          style={{ x: interlockX, rotate: interlockRotate, scale: shapeScale }}
        />
        <motion.img
          className="shape-fold"
          src={shapeFold}
          alt="Flowing orange and teal sculptural fold"
          style={{ x: foldX, rotate: foldRotate, scale: shapeScale }}
        />
        <motion.div className="shape-transition-copy" style={{ opacity: copyOpacity, y: copyY }}>
          <p>Useful can still be beautiful.</p>
          <h2 id="shape-title">Good design<br />finds a way in.</h2>
          <Link to="/products">Explore the collection <EditorialArrow /></Link>
        </motion.div>
      </div>
    </section>
  );
}

function ScrollStory() {
  const stageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [180, -180]);
  const imageRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-8, 0, 8]);
  const imageScale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.72, 1, 0.78]);
  const discoverX = useTransform(scrollYProgress, [0.18, 0.45], ["-55vw", "0vw"]);
  const chooseX = useTransform(scrollYProgress, [0.3, 0.57], ["55vw", "0vw"]);
  const loveX = useTransform(scrollYProgress, [0.45, 0.7], ["-55vw", "0vw"]);
  const repeatX = useTransform(scrollYProgress, [0.58, 0.83], ["55vw", "0vw"]);
  const textOpacity = useTransform(scrollYProgress, [0.12, 0.28, 0.8, 0.92], [0, 1, 1, 0]);

  return (
    <section className="scroll-story" ref={stageRef} aria-label="How shopping feels">
      <div className="scroll-story-sticky">
        <p>Scroll to move through the edit</p>
        <motion.img src={scrollStoryImage} alt="Gold and cream headphones on a sculptural pedestal" style={{ y: imageY, rotate: imageRotate, scale: imageScale }} />
        <motion.div className="scroll-words" style={{ opacity: textOpacity }}>
          <motion.span style={{ x: discoverX }}>Discover.</motion.span>
          <motion.span style={{ x: chooseX }}>Choose.</motion.span>
          <motion.span style={{ x: loveX }}>Love.</motion.span>
          <motion.span style={{ x: repeatX }}>Repeat.</motion.span>
        </motion.div>
      </div>
    </section>
  );
}

function CampaignFeature() {
  const stageRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start start", "end end"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.14, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const shadeOpacity = useTransform(scrollYProgress, [0, 0.48, 1], [0.62, 0.3, 0.66]);
  const copyY = useTransform(scrollYProgress, [0, 0.62, 1], [90, 0, -70]);
  const copyOpacity = useTransform(scrollYProgress, [0.05, 0.3, 0.84, 1], [0, 1, 1, 0]);

  return (
    <section className="campaign-feature" ref={stageRef} aria-labelledby="campaign-title">
      <div className="campaign-feature-sticky">
        <motion.img src={campaignWide} alt="A warm Cairo-inspired room curated with ShopSphere pieces" style={{ scale: imageScale, y: imageY }} />
        <motion.div className="campaign-shade" style={{ opacity: shadeOpacity }} />
        <div className="campaign-topline"><span>04 / The campaign</span><span>Cairo, golden hour</span></div>
        <motion.div className="campaign-copy" style={{ y: copyY, opacity: copyOpacity }}>
          <p>Room for your point of view</p>
          <h2 id="campaign-title">Live with<br /><em>good things.</em></h2>
          <Link to="/products">See the full edit <EditorialArrow /></Link>
        </motion.div>
      </div>
    </section>
  );
}

function HorizontalChapters({ products }) {
  const chapterRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: chapterRef, offset: ["start start", "end end"] });
  const trackX = useTransform(scrollYProgress, [0, 1], ["0%", "-72%"]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const chapters = [
    ["Work", "Objects that sharpen your focus."],
    ["Rest", "Comfort designed into the everyday."],
    ["Move", "Essentials that keep up with you."],
    ["Ritual", "Small details that change the mood."],
  ];

  return (
    <section className="horizontal-chapters" ref={chapterRef} aria-labelledby="chapters-title">
      <div className="horizontal-chapters-sticky">
        <div className="chapters-topline">
          <span>03 / Made for living</span>
          <h2 id="chapters-title">Shop by <em>moment.</em></h2>
          <span>Keep scrolling</span>
        </div>
        <motion.div className="chapters-track" style={{ x: trackX }}>
          {chapters.map(([title, copy], index) => {
            const product = products[index % products.length];
            return (
              <article className="chapter-card" key={title}>
                <Link to={productHrefForChapter(product)}>
                  <div className="chapter-image"><img src={product.image} alt={product.name} /></div>
                  <div className="chapter-copy"><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p><EditorialArrow /></div>
                </Link>
              </article>
            );
          })}
        </motion.div>
        <div className="chapters-progress"><motion.span style={{ scaleX: progressScale }} /></div>
      </div>
    </section>
  );
}

function productHrefForChapter(product) {
  const id = String(product.id || product._id || "");
  return id.startsWith("landing-") ? `/products?category=${product.category}` : `/products/${id}`;
}

function Explore() {
  const displayProducts = LANDING_PRODUCTS;
  const heroProduct = displayProducts[0];
  const { scrollY } = useScroll();
  const heroTextX = useTransform(scrollY, [0, 700], [0, -240]);
  const heroImageY = useTransform(scrollY, [0, 700], [0, 190]);
  const heroImageScale = useTransform(scrollY, [0, 700], [1, 0.78]);
  const heroRibbonY = useTransform(scrollY, [0, 700], [0, -125]);
  const heroRibbonRotate = useTransform(scrollY, [0, 700], [-5, 9]);

  const productHref = (product) =>
    String(product.id || product._id || "").startsWith("landing-")
      ? `/products?category=${product.category}`
      : `/products/${product.id || product._id}`;

  return (
    <main className="editorial-home">
      <section className="editorial-hero" aria-labelledby="hero-title">
        <div className="hero-meta hero-meta-left"><span>Curated objects</span><span>For modern living</span></div>
        <div className="hero-meta hero-meta-right"><span>New collection</span><span>Edition 01 / 26</span></div>

        <motion.div className="hero-copy" style={{ x: heroTextX }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <p className="hero-kicker">Selected with intention</p>
          <h1 id="hero-title">Objects worth keeping.</h1>
        </motion.div>

        <motion.img className="hero-ribbon" src={shapeRibbon} alt="" aria-hidden="true" style={{ y: heroRibbonY, rotate: heroRibbonRotate }} />

        <motion.div className="hero-product" style={{ y: heroImageY, scale: heroImageScale }} initial={{ opacity: 0, rotate: -3 }} animate={{ opacity: 1, rotate: 0 }} transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}>
          <Link to={productHref(heroProduct)} aria-label={`View ${heroProduct.name}`}>
            <img src={heroEditorial} alt="A curated collection of headphones, fragrance, leather goods and decorative objects" loading="eager" fetchPriority="high" />
            <span className="hero-product-number">01</span>
          </Link>
        </motion.div>

        <Link className="round-cta" to="/products" aria-label="Shop the collection"><BiArrowFromLeft aria-hidden="true" /></Link>
      </section>

      <div className="editorial-ticker" aria-label="Our approach">
        <div><span>Considered</span><i>✦</i><span>Useful</span><i>✦</i><span>Beautiful</span><i>✦</i><span>Made to last</span><i>✦</i><span>Considered</span><i>✦</i><span>Useful</span><i>✦</i></div>
      </div>

      <section className="category-index" aria-labelledby="category-title">
        <div className="section-eyebrow"><span>01 / Departments</span><span>Explore the edit</span></div>
        <div className="category-heading-row">
          <h2 id="category-title">Find your next<br /><em>favorite thing.</em></h2>
          <p>Six thoughtful departments. No endless aisles. Just products selected for how well they look, feel, and live with you.</p>
        </div>
        <div className="category-list">
          {categories.map((category, index) => (
            <motion.div key={category} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.45 }} transition={{ duration: 0.45, delay: index * 0.04 }}>
              <Link to={`/products?category=${category}`}>
                <span className="category-number">0{index + 1}</span><span className="category-name">{category}</span><span className="category-arrow"><EditorialArrow /></span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <ShapeTransition />

      <ScrollStory />

      <section className="product-edit" aria-labelledby="product-edit-title">
        <div className="section-eyebrow section-eyebrow-light"><span>02 / The edit</span><span>Curated for ShopSphere</span></div>
        <div className="product-edit-heading">
          <h2 id="product-edit-title">Not everything.<br /><em>Just the right things.</em></h2>
          <Link to="/products">Shop all <EditorialArrow /></Link>
        </div>
        <div className="editorial-product-grid">
          {displayProducts.slice(0, 4).map((product, index) => (
            <motion.article className={`editorial-product-card card-${index + 1}`} key={product.id || product._id || product.name} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55 }}>
              <Link to={productHref(product)}>
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} loading={index === 0 ? "eager" : "lazy"} />
                  <span>View piece <EditorialArrow /></span>
                </div>
                <div className="product-caption">
                  <div><p>{product.category}</p><h3>{product.name}</h3></div>
                  <strong>${Number(product.price || 0).toLocaleString()}</strong>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <HorizontalChapters products={displayProducts.slice(0, 4)} />

      <CampaignFeature />

      <section className="customer-voices" aria-labelledby="voices-title">
        <div className="section-eyebrow"><span>05 / In good company</span><span>Notes from customers</span></div>
        <motion.blockquote initial={{ opacity: 0, y: 55 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .45 }} transition={{ duration: .8 }}>
          <span>“</span>
          <p id="voices-title">It feels less like searching a warehouse and more like walking into a beautifully edited room.</p>
          <footer>— Maya, Alexandria</footer>
        </motion.blockquote>
        <div className="voice-stats">
          <div><strong>30</strong><span>Days to decide</span></div>
          <div><strong>4.9</strong><span>Average rating</span></div>
          <div><strong>24/7</strong><span>Order tracking</span></div>
        </div>
      </section>

      <section className="manifesto">
        <div className="manifesto-mark">S</div>
        <motion.p variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7 }}>Less scrolling.<br />More <em>finding.</em></motion.p>
        <Link to="/products" className="manifesto-link">Enter the shop <EditorialArrow /></Link>
      </section>

      <section className="service-notes" aria-label="Shopping promises">
        {[["Delivery", "Free shipping on orders over $50, packed carefully and sent quickly."], ["Returns", "Thirty days to decide. Straightforward returns, without the small print."], ["Support", "Real help when you need it, before or after your order arrives."]].map(([title, copy], index) => (
          <div key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p></div>
        ))}
      </section>
    </main>
  );
}

export default Explore;
