"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Ingredient {
  name: string;
  emoji: string;
  traditional: string;
  science: string;
  color: string;
}

interface Founder {
  id: number;
  name: string;
  title: string;
  emoji: string;
  bio: string;
  background: string;
  journey: string;
  expertise: string[];
  color: string;
  accentColor: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const INGREDIENTS: Ingredient[] = [
  {
    name: "Amaranth (Rajgira)",
    emoji: "🌾",
    traditional: "Sacred, strength-giving grain used during fasting for energy, purity, and nourishment.",
    science: "Complete protein; rich in iron, calcium, antioxidants; supports muscle health and energy.",
    color: "#C8860A",
  },
  {
    name: "Barnyard Millet (Sama)",
    emoji: "🌿",
    traditional: "Light, easily digestible, sattvic; supports balance and digestion during fasting.",
    science: "Low GI; high fiber; supports blood sugar control and gut health.",
    color: "#5C8A3C",
  },
  {
    name: "Singhada (Water Chestnut)",
    emoji: "💧",
    traditional: "Cooling, strength-giving food traditionally consumed during fasting.",
    science: "Rich in potassium and antioxidants; supports hydration; gluten-free.",
    color: "#2E7D9A",
  },
  {
    name: "Blueberry",
    emoji: "🫐",
    traditional: "Vibrant fruits considered nourishing and vitality-enhancing.",
    science: "High antioxidants; supports brain health, immunity, reduces oxidative stress.",
    color: "#5B4B8A",
  },
  {
    name: "Nuts & Seeds",
    emoji: "🥜",
    traditional: "Consumed for strength, clarity, and vitality in traditional practice.",
    science: "Rich in healthy fats, protein; supports heart and brain; long-lasting energy.",
    color: "#A0522D",
  },
];

// ─── Founders Data ───────────────────────────────────────────────────────────
const FOUNDERS: Founder[] = [
  {
    id: 1,
    name: "Dr. Shikha Jain",
    title: "Co-Founder & Chief Scientist",
    emoji: "🔬",
    bio: "Ph.D. and Postdoctoral in Biotechnology from University of Calgary, Canada with more than a decade of experience in natural product microbiology and applied biosciences.",
    background: "Spiritually inclined with a lifestyle emphasizing purity in food and conscious eating. Her personal journey as a mother seeking clean, nutritious, and trustworthy snack options for her daughter sparked the creation of Vrateez Foods.",
    journey: "Recognizing the market gap—products claiming health but lacking transparency and real nutritional value—she combined scientific expertise with personal conviction to create clean-label, millet-based, functionally nutritious foods.",
    expertise: [
      "Gluten-free formulations",
      "Natural product development",
      "Gut health optimization",
      "Nutritional science",
      "Food microbiology"
    ],
    color: "#2E7D9A",
    accentColor: "#5B4B8A"
  },
  {
    id: 2,
    name: "Diksha Kumari",
    title: "Co-Founder & Business Lead",
    emoji: "💼",
    bio: "Environmental scientist by degree and business enthusiast by passion. She brings strategic focus on business operations, brand development, and deep consumer understanding at Vrateez Foods.",
    background: "Her entrepreneurial journey stemmed from recognizing a crucial gap in the market—products were either convenient or healthy, but rarely both. This insight became the driving force behind building a brand delivering nutrition without compromise.",
    journey: "With keen interest in health-conscious living and evolving consumer preferences, she identified and bridged the convenience-nutrition gap. She translates research-backed products into market-ready solutions that resonate with today's consumers.",
    expertise: [
      "Product positioning",
      "Market strategy",
      "Brand development",
      "Consumer engagement",
      "Business operations"
    ],
    color: "#C8860A",
    accentColor: "#5C8A3C"
  },
];

// ─── Animated Counter ────────────────────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const step = Math.ceil(end / (duration / 16));
          const timer = setInterval(() => {
            start += step;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-brand-primary font-serif leading-none">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

// ─── Ingredient Card ─────────────────────────────────────────────────────────
function IngredientCard({ ing, index }: { ing: Ingredient; index: number; key?: string | number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onClick={() => setFlipped(!flipped)}
      className="perspective-1000 cursor-pointer h-64 w-full"
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 preserve-3d ${flipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front */}
        <div
          className="absolute inset-0 backface-hidden rounded-3xl flex flex-col items-center justify-center gap-4 p-6 border border-brand-primary/20"
          style={{ background: `linear-gradient(135deg, ${ing.color}15 0%, ${ing.color}05 100%)` }}
        >
          <div className="text-5xl transform transition-transform hover:scale-110 duration-300">{ing.emoji}</div>
          <div className="text-lg font-bold text-center font-serif" style={{ color: ing.color }}>
            {ing.name}
          </div>
          <div className="text-[10px] text-gray-400 tracking-[0.2em] font-bold">TAP TO EXPLORE</div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl flex flex-col justify-center p-6 gap-4 text-white"
          style={{ background: `linear-gradient(135deg, ${ing.color}EE, ${ing.color}AA)` }}
        >
          <div>
            <div className="text-[10px] tracking-[0.15em] text-white/70 font-bold mb-1">🏺 TRADITIONAL</div>
            <div className="text-xs leading-relaxed">{ing.traditional}</div>
          </div>
          <div className="w-full h-px bg-white/20" />
          <div>
            <div className="text-[10px] tracking-[0.15em] text-white/70 font-bold mb-1">🔬 SCIENCE</div>
            <div className="text-xs leading-relaxed">{ing.science}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Founder Card ────────────────────────────────────────────────────────────
function FounderCard({ founder, index }: { founder: Founder; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="h-full"
    >
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className="relative h-full rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${founder.color}15 0%, ${founder.accentColor}10 100%)`,
          border: `2px solid ${founder.color}30`
        }}
      >
        {/* Content */}
        <div className="relative h-full p-8 md:p-10 flex flex-col space-y-7">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-5xl mb-4">{founder.emoji}</div>
              <h3 style={{ color: founder.color }} className="text-3xl md:text-4xl font-black mb-2">
                {founder.name}
              </h3>
              <p className="text-base md:text-lg font-bold tracking-[0.16em] text-gray-600 uppercase">
                {founder.title}
              </p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed font-serif italic">
              "{founder.bio}"
            </p>
          </div>

          {/* Journey/Background */}
          <div>
            <div className="text-xs md:text-sm font-black tracking-[0.16em] mb-2 uppercase" style={{ color: founder.color }}>
              📖 Journey
            </div>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {founder.journey}
            </p>
          </div>

          {/* Background Story */}
          <div>
            <div className="text-xs md:text-sm font-black tracking-[0.16em] mb-2 uppercase" style={{ color: founder.color }}>
              💡 Background
            </div>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {founder.background}
            </p>
          </div>

          {/* Expertise/Focus Areas */}
          <div>
            <div className="text-xs md:text-sm font-black tracking-[0.16em] mb-3 uppercase" style={{ color: founder.color }}>
              ⭐ Areas of Expertise
            </div>
            <div className="flex flex-wrap gap-2">
              {founder.expertise.map((skill) => (
                <motion.span
                  key={skill}
                  whileHover={{ scale: 1.05 }}
                  className="px-3.5 py-2 bg-white text-sm font-bold rounded-full border-2 transition-all cursor-default"
                  style={{
                    borderColor: founder.color,
                    color: founder.color
                  }}
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AboutUs() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFAF5] text-[#2A1F0E] selection:bg-brand-primary selection:text-white">
      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] grain-overlay" />

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          {[
            { size: 600, top: "-10%", right: "-10%", color: "bg-brand-primary/5" },
            { size: 400, bottom: "10%", left: "-5%", color: "bg-brand-secondary/5" },
            { size: 300, top: "40%", left: "20%", color: "bg-brand-primary/3" },
          ].map((c, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute rounded-full blur-3xl ${c.color}`}
              style={{
                width: c.size,
                height: c.size,
                top: c.top,
                bottom: c.bottom,
                left: c.left,
                right: c.right,
                transform: `translateY(${scrollY * (0.05 + i * 0.02)}px)`
              }}
            />
          ))}
        </div>

        {/* <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {["🌾", "🌿", "💧", "🥜", "✨"].map((emoji, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 0.15,
                y: [0, -30, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.5
              }}
              className="absolute text-4xl"
              style={{
                top: `${20 + i * 12}%`,
                left: i % 2 === 0 ? `${10 + i * 10}%` : 'auto',
                right: i % 2 !== 0 ? `${10 + i * 8}%` : 'auto',
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div> */}

        <div className="relative z-10 container mx-auto px-6 text-center max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-4 py-1.5 rounded-full border border-orange-200 text-orange-700 text-xs font-semibold uppercase tracking-widest bg-orange-50">
              Tradition Meets Innovation
            </span>
            <h1 className="mt-8 text-6xl md:text-8xl font-serif text-slate-900 leading-tight">
              About <span className="italic text-orange-700">Vrateez</span>—<br />
              Restoring Trust
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
              "A symphony of taste and wellness crafted for every moment—where 
              <span className="font-medium text-slate-800"> ancient Vedic wisdom </span>
              meets <span className="font-medium text-slate-800"> modern nutritional science</span>."
            </p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="mt-14 max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-center gap-5 md:gap-8 mb-6 text-orange-300/90">
                <div className="h-px w-20 md:w-40 bg-orange-200/80" />
                <span className="text-3xl md:text-4xl text-orange-600 leading-none">ॐ</span>
                <div className="h-px w-20 md:w-40 bg-orange-200/80" />
              </div>

              <div className="rounded-[2rem] border border-orange-200/80 bg-[#FFFDF8]/90 backdrop-blur-sm shadow-[0_25px_65px_-35px_rgba(200,134,10,0.55)] px-6 py-8 md:px-12 md:py-10">
                <p className="text-2xl md:text-4xl font-serif italic text-[#CB5F2A] leading-snug">
                  "आयुः सत्त्वबलारोग्यसुखप्रीतिविवर्धनाः।<br />
                  रस्याः स्निग्धाः स्थिरा हृद्या आहाराः सात्त्विकप्रियाः॥"
                </p>

                <div className="h-px w-12 md:w-16 bg-orange-300/80 mx-auto my-8" />

                <p className="text-[1.7rem] leading-relaxed max-w-3xl mx-auto text-slate-600 font-serif italic">
                  "Foods that promote longevity, vitality, strength, health, happiness, and satisfaction — wholesome, nourishing, pure, and pleasing to the heart."
                </p>

                <p className="mt-6 text-sm md:text-base uppercase tracking-[0.2em] text-[#CB5F2A] font-semibold">
                  Bhagwat Gita — Chapter 17, Verse 8
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-100 rounded-full blur-3xl opacity-50" />
      </section>

      {/* ── Stats Strip ── */}
      <section className="bg-brand-dark py-20 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Happy Customers", end: 10000, suffix: "+" },
              { label: "Pure Ingredients", end: 100, suffix: "%" },
              { label: "Vrat-Friendly SKUs", end: 25, suffix: "+" },
              { label: "Years of Research", end: 5, suffix: "+" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <Counter end={s.end} suffix={s.suffix} />
                <div className="text-[10px] font-black tracking-[0.2em] text-gray-500 mt-4 uppercase group-hover:text-brand-primary transition-colors">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section id="our-story" className="py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[3rem] bg-gradient-to-br from-brand-primary/20 to-brand-secondary/10 relative overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-9xl mb-8"
                  >
                    🌾
                  </motion.div>
                  <h3 className="text-3xl font-black font-serif text-brand-dark leading-tight">
                    Pure. Honest. <br />
                    <span className="text-brand-primary">Nourishing.</span>
                  </h3>
                </div>

                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute bottom-8 right-8 bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold text-xs tracking-widest shadow-xl"
                >
                  VRAT FRIENDLY ✓
                </motion.div>
              </div>

              <div className="absolute -top-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl border border-brand-primary/10 hidden lg:block">
                <div className="text-xs font-black text-gray-400 tracking-widest mb-1">FOUNDED</div>
                <div className="text-3xl font-black text-brand-dark font-serif">Vrateez</div>
                <div className="text-[10px] font-bold text-brand-primary tracking-[0.3em]">FOODS PVT. LTD.</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-xs font-black tracking-[0.3em] text-brand-primary mb-6 uppercase">◆ Our Story</div>
              <h2 className="text-5xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tighter">
                Born Out of <span className="italic font-serif text-brand-primary">Responsibility</span>
              </h2>

              <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-serif italic">
                <p>
                  "In today's busy life, one question keeps coming up—where can we find food that is healthy, pure, and ready to eat instantly?"
                </p>
                <p className="not-italic font-sans text-base">
                  Enter Vrateez—a symphony of taste and wellness crafted for every moment. Whether you are rushing for a meeting, catching a flight at dawn, or packing a mindful lunch, Vrateez walks beside you.
                </p>
                <p className="not-italic font-sans text-base">
                  Years of studies, countless trials, and a deep respect for tradition have brought this humble reputation to Vrateez. Today, we are a household name among thousands of happy customers.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 mt-10">
                {["Pure Ingredients", "Honest Preparation", "Nourishing"].map((v) => (
                  <motion.div
                    key={v}
                    whileHover={{ scale: 1.05, backgroundColor: '#C8860A', color: '#fff' }}
                    className="px-6 py-2.5 border-2 border-brand-primary rounded-full text-xs font-bold text-brand-primary cursor-default transition-colors"
                  >
                    ✓ {v.toUpperCase()}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Philosophy (Ingredients) ── */}
      <section id="philosophy" className="py-32 bg-gradient-to-b from-[#1D1710] via-[#241B12] to-[#302015] text-[#F6EEDB]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="text-sm font-black tracking-[0.3em] text-orange-300 mb-6 uppercase">◆ Our Philosophy</div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-[#FFF9EC]">
              Ancient Wisdom <br />
              <span className="italic font-serif text-orange-300">& Modern Science</span>
            </h2>
            <p className="text-xl text-[#E9D8BF] max-w-2xl mx-auto font-serif italic">
              "Every ingredient is chosen with the wisdom of tradition and validated by modern science."
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {INGREDIENTS.map((ing, i) => (
              <IngredientCard key={ing.name} ing={ing} index={i} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs font-black tracking-[0.3em] text-orange-200 uppercase animate-pulse">
              Tap any card to explore the science
            </p>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="pt-32 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Mission */}
            <motion.div
              id="mission"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 bg-brand-dark rounded-[3rem] text-white relative overflow-hidden group"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150" />
              <div className="text-5xl mb-8">🎯</div>
              <div className="text-[10px] font-black tracking-[0.3em] text-brand-primary mb-4 uppercase">Our Mission</div>
              <h3 className="text-3xl font-black font-serif mb-6 leading-tight">
                Clean, Pure & Accessible <br />
                for Every Household
              </h3>
              <p className="text-gray-400 leading-relaxed font-serif italic text-lg">
                To provide pure, clean-label, and millet-based food products that are scientifically designed to support health, while respecting traditional dietary practices.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              id="vision"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-12 bg-brand-primary rounded-[3rem] text-white relative overflow-hidden group"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150" />
              <div className="text-5xl mb-8">🌱</div>
              <div className="text-[10px] font-black tracking-[0.3em] text-white/70 mb-4 uppercase">Our Vision</div>
              <h3 className="text-3xl font-black font-serif mb-6 leading-tight">
                A Holistic Food Ecosystem <br />
                for India & Beyond
              </h3>
              <div className="space-y-4">
                {[
                  "Promotes millet & sustainable agriculture",
                  "Supports farmer livelihoods",
                  "Innovation in functional nutrition",
                  "Global symbol of clean Indian nutrition",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-black">{i + 1}</div>
                    <p className="text-sm font-bold tracking-wide">{item.toUpperCase()}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Trust Quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-12 p-12 bg-white border border-brand-primary/10 rounded-[3rem] text-center shadow-xl shadow-brand-primary/5"
          >
            <p className="text-2xl md:text-3xl font-black font-serif italic text-brand-dark leading-snug">
              "Our long-term goal is to create a category where food is not just consumed—but <span className="text-brand-primary">trusted, understood, and valued.</span>"
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Founders Section ── */}
      <section id="founders" className="pt-10 pb-32 px-6 bg-gradient-to-b from-[#FDFAF5] to-white">
        <div className="container mx-auto max-w-6xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-xl md:text-3xl font-black tracking-[0.16em] text-brand-primary mb-6 uppercase">◆ Meet the Visionaries</div>
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[1.1]">
              The <span className="italic font-serif text-brand-primary">Hearts & Minds</span>
              <br /> Behind Vrateez
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-serif italic leading-relaxed">
              "Where scientific rigor meets personal conviction—building a brand you can truly trust."
            </p>
          </motion.div>

          {/* Founders Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {FOUNDERS.map((founder, i) => (
              <FounderCard key={founder.id} founder={founder} index={i} />
            ))}
          </div>

          {/* Founders Vision Quote */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-16 p-12 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border border-brand-primary/20 rounded-[3rem] text-center"
          >
            <div className="text-4xl mb-6">🤝</div>
            <p className="text-2xl md:text-3xl font-black font-serif italic text-brand-dark leading-snug">
              "Food should nourish the body, <br />respect our values, and be something <br />we can <span className="text-brand-primary">trust every day.</span>"
            </p>
            <p className="text-sm mt-6 text-gray-600 font-semibold tracking-widest uppercase">
              — Dr. Shikha Jain & Diksha Kumari
            </p>
          </motion.div>

          {/* Why They Matter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 grid md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: "🔬",
                title: "Science-Backed",
                desc: "Every product grounded in rigorous research and biotechnological expertise"
              },
              {
                icon: "❤️",
                title: "Purpose-Driven",
                desc: "Founded on personal values and genuine concern for consumer wellness"
              },
              {
                icon: "🌱",
                title: "Sustainable Focus",
                desc: "Supporting farmers, promoting millets, and building a holistic ecosystem"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white border-2 border-brand-primary/20 hover:border-brand-primary/50 transition-all text-center"
              >
                <div className="text-4xl mb-4 inline-block">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-brand-dark">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}