"use client";

import { motion } from "framer-motion";
import { BadgeCheck, Wheat, Tag, FlaskConical, Sprout, Zap, Factory, Sparkles, Ban, Leaf } from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const WHY_CHOOSE = [
  { icon: BadgeCheck, title: "100% Fasting-Compliant", desc: "Every product is fully vrat-friendly — made with ingredients that honor fasting traditions." },
  { icon: Wheat, title: "Power of Millets", desc: "Gluten-free, ancient grains like amaranth and barnyard millet at the heart of every product." },
  { icon: Tag, title: "Clean-Label Ingredients", desc: "Nothing hidden. Every ingredient listed clearly — no chemicals, no fillers." },
  { icon: FlaskConical, title: "Science-Backed", desc: "Formulations rooted in food biotechnology, probiotics research, and Vedic nutritional principles." },
  { icon: Sprout, title: "Gut & Wellness Support", desc: "High-fiber, probiotic-aligned formulas designed to support digestion and long-term health." },
  { icon: Zap, title: "Healthy Convenience", desc: "Nutritious, ready-to-eat food that fits every moment — meetings, travel, family." },
  { icon: Factory, title: "In-House Manufacturing", desc: "Complete quality control from sourcing to packaging — every batch made by us." },
  { icon: Sparkles, title: "Tradition Meets Innovation", desc: "Ancient Vedic wisdom meets modern nutritional science in every bite." },
  { icon: Ban, title: "No Palm Oil", desc: "We use only clean, wholesome fats — never palm oil." },
  { icon: Leaf, title: "No Onion, No Garlic", desc: "Sattvic, pure ingredients that respect traditional and dietary preferences." },
];

const FOUNDERS = [
  {
    name: "Dr. Shikha Jain",
    title: "Co-Founder & Chief Scientist",
    initials: "SJ",
    color: "#26362A", // basil
    bio: "Ph.D. and Postdoctoral in Biotechnology from University of Calgary, Canada. Over a decade of experience in natural product microbiology and applied biosciences.",
    story: "Spiritually inclined and personally committed to purity in food, Dr. Shikha's journey as a mother — seeking clean, nutritious snacks for her daughter — sparked Vrateez. Recognizing the gap between health claims and actual nutritional integrity, she combined scientific expertise with personal conviction to create truly clean-label, millet-based foods.",
    expertise: ["Gluten-free formulations", "Natural product development", "Gut health optimization", "Food microbiology"],
  },
  {
    name: "Diksha Kumari",
    title: "Co-Founder & Business Lead",
    initials: "DK",
    color: "#9C4221", // clay
    bio: "Environmental scientist by degree and business strategist by passion. Focused on brand development, operations, and deep consumer understanding.",
    story: "Diksha identified a gap the market kept ignoring — products were either convenient or healthy, rarely both. This insight became the driving force behind a brand that delivers nutrition without compromise. She translates research-backed products into market-ready solutions that resonate with today's health-conscious consumers.",
    expertise: ["Product positioning", "Market strategy", "Brand development", "Consumer engagement"],
  },
];

// ─── Fade-in wrapper ─────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-6 h-px bg-turmeric" />
      <span className="font-label text-xs tracking-[0.22em] text-clay uppercase">{children}</span>
    </div>
  );
}

// ─── Founder Card ─────────────────────────────────────────────────────────────
function FounderCard({ founder, index }: { founder: typeof FOUNDERS[0]; index: number }) {
  return (
    <FadeIn delay={index * 0.12}>
      <div className="bg-white/60 border border-ink/10 rounded-2xl p-8 md:p-10 h-full flex flex-col gap-6">
        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-parchment font-bold text-base flex-shrink-0"
            style={{ backgroundColor: founder.color }}
          >
            {founder.initials}
          </div>
          <div>
            <h3 className="font-display italic text-xl text-ink">{founder.name}</h3>
            <p className="text-sm text-ink/50 mt-0.5">{founder.title}</p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-ink/70 leading-relaxed italic border-l-2 border-ink/10 pl-4">
          {founder.bio}
        </p>

        {/* Story */}
        <p className="text-sm text-ink/70 leading-relaxed flex-1">{founder.story}</p>

        {/* Expertise */}
        <div>
          <p className="font-label text-xs tracking-widest text-ink/35 uppercase mb-3">Areas of Expertise</p>
          <div className="flex flex-wrap gap-2">
            {founder.expertise.map((s) => (
              <span
                key={s}
                className="px-3 py-1 text-xs font-medium rounded-full border"
                style={{ borderColor: founder.color + "55", color: founder.color, backgroundColor: founder.color + "0D" }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AboutUs() {
  return (
    <div className="min-h-screen bg-parchment text-ink font-sans">

      {/* ─── Hero ─── */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[560px] h-[560px] rounded-full bg-millet/15 blur-3xl translate-x-1/3 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-turmeric/10 blur-3xl -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="container mx-auto max-w-4xl text-center">
          <FadeIn>
            <span className="inline-block px-4 py-1.5 rounded-full border border-turmeric/30 bg-turmeric/8 text-clay font-label text-xs tracking-widest uppercase mb-8">
              Tradition Meets Innovation
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-ink leading-tight tracking-tight mb-6">
              About <em className="text-turmeric not-italic">Vrateez</em>
            </h1>
            <p className="text-lg md:text-xl text-ink/60 max-w-2xl mx-auto leading-relaxed">
              A symphony of taste and wellness — where ancient Vedic wisdom meets modern nutritional science.
            </p>
          </FadeIn>

          {/* Gita verse */}
          <FadeIn delay={0.2}>
            <div className="mt-14 max-w-2xl mx-auto rounded-2xl border border-turmeric/20 bg-white/60 backdrop-blur px-8 py-8 text-center">
              <p className="font-label text-sm text-clay tracking-widest uppercase mb-4">Bhagavad Gita — Chapter 17, Verse 8</p>
              <p className="font-display text-2xl md:text-3xl text-clay leading-snug mb-5">
                &quot;आयुः सत्त्वबलारोग्यसुखप्रीतिविवर्धनाः।<br />
                रस्याः स्निग्धाः स्थिरा हृद्या आहाराः सात्त्विकप्रियाः॥&quot;
              </p>
              <p className="text-ink/60 text-base md:text-lg leading-relaxed italic">
                &quot;Foods that promote longevity, vitality, strength, health, happiness, and satisfaction — wholesome, nourishing, pure, and pleasing to the heart.&quot;
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Our Story ─── */}
      <section className="py-20 px-6 border-t border-ink/10">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div>
              <SectionLabel>Our Story</SectionLabel>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight mb-6">
                Born Out of <br /><em className="text-turmeric">Responsibility</em>
              </h2>
              <div className="space-y-4 text-ink/70 leading-relaxed">
                <p>
                  In today&apos;s busy life, one question keeps coming up — where can we find food that is healthy, pure, and ready to eat instantly? Finding snacks that are both nutritious and convenient often feels like a difficult balance.
                </p>
                <p>
                  Enter Vrateez — whether you are rushing for a meeting, catching a flight at dawn, packing a mindful lunch for your child, or seeking a quick spark of energy between college hours, Vrateez walks beside you.
                </p>
                <p>
                  Each ingredient is chosen carefully for its health benefits. The principles of food biotechnology, probiotics, and Vedic knowledge — focused on health, longevity, and healing — guide every product.
                </p>
                <p>
                  Years of studies, countless trials, and a deep respect for tradition have built Vrateez into a household name among thousands of happy, satisfied customers.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="rounded-2xl bg-ink text-parchment p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-turmeric/20 blur-2xl translate-x-1/4 -translate-y-1/4" />
              <p className="font-label text-xs tracking-widest text-millet uppercase mb-4">Good News</p>
              <h3 className="font-display text-2xl font-bold mb-4">All Vrateez items are<br />Vrat Friendly ✓</h3>
              <p className="text-parchment/60 leading-relaxed text-sm">
                Fasting in Indian tradition is not just about avoiding food — it is about cleansing the body, calming the mind, and honoring a deeper connection with what we consume. Yet, the modern food market had failed to respect this sentiment.
              </p>
              <p className="text-parchment/60 leading-relaxed text-sm mt-4">
                This gap sparked the foundation of Vrateez Foods Pvt. Ltd. — a brand born not just out of opportunity, but out of responsibility. We set out to create food that is pure in ingredients, honest in preparation, and nourishing in every sense.
              </p>
              <div className="mt-6 pt-6 border-t border-parchment/15 grid grid-cols-3 gap-4 text-center">
                {["Pure", "Honest", "Nourishing"].map((v) => (
                  <div key={v}>
                    <div className="text-millet font-bold text-sm">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Mission & Vision ─── */}
      <section className="py-20 px-6 bg-ink/[0.03] border-y border-ink/10">
        <div className="container mx-auto max-w-5xl grid md:grid-cols-2 gap-8">
          <FadeIn>
            <div className="bg-white/60 rounded-2xl p-10 border border-ink/10 h-full">
              <SectionLabel>Our Mission</SectionLabel>
              <h3 className="font-display text-2xl font-bold text-ink mb-4 leading-snug">
                Clean, Pure & Accessible<br />for Every Household
              </h3>
              <p className="text-ink/70 leading-relaxed">
                To provide pure, clean-label, and millet-based food products that are scientifically designed to support health, while respecting traditional dietary practices. We aim to make nutritious, fasting-compliant, and convenient food accessible to every household without compromising on quality, taste, or trust.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.12}>
            <div className="bg-turmeric text-parchment rounded-2xl p-10 h-full">
              <p className="font-label text-xs tracking-widest text-parchment/70 uppercase mb-3">Our Vision</p>
              <h3 className="font-display text-2xl font-bold mb-6 leading-snug">
                A Holistic Food Ecosystem<br />for India & Beyond
              </h3>
              <ul className="space-y-3">
                {[
                  "Promotes millet consumption and sustainable agriculture",
                  "Supports farmer livelihoods through value addition",
                  "Leads innovation in functional and preventive nutrition",
                  "Expands globally as a symbol of clean Indian nutrition",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-parchment/90">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-parchment/20 flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <div className="container mx-auto max-w-5xl mt-8">
            <div className="bg-white/60 rounded-2xl p-10 border border-ink/10 text-center">
              <p className="font-display text-xl md:text-2xl text-ink leading-snug max-w-3xl mx-auto">
                &quot;Our long-term goal is to create a category where food is not just consumed — but{" "}
                <span className="text-turmeric font-semibold">trusted, understood, and valued.</span>&quot;
              </p>
              <p className="mt-5 font-label text-sm text-ink/35 tracking-widest uppercase">— Vrateez Foods</p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ─── Why Choose ─── */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel>Why Choose Vrateez</SectionLabel>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight">
                We Don&apos;t Just Make Food —<br />
                <em className="text-turmeric">We Restore Trust</em>
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-5">
            {WHY_CHOOSE.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.05}>
                <div className="flex gap-5 p-6 rounded-xl border border-ink/10 bg-white/50 hover:border-turmeric/40 hover:shadow-sm transition-all duration-200">
                  <div className="shrink-0">
                    <item.icon size={24} className="text-basil" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-ink mb-1">{item.title}</h4>
                    <p className="text-sm text-ink/50 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Founders ─── */}
      <section className="py-20 px-6 bg-ink/[0.03] border-t border-ink/10">
        <div className="container mx-auto max-w-5xl">
          <FadeIn>
            <div className="text-center mb-14">
              <SectionLabel>Meet the Founders</SectionLabel>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight">
                The Hearts & Minds<br />
                <em className="text-turmeric">Behind Vrateez</em>
              </h2>
              <p className="mt-4 text-ink/50 max-w-xl mx-auto text-base">
                Where scientific rigour meets personal conviction — building a brand you can truly trust.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            {FOUNDERS.map((founder, i) => (
              <FounderCard key={founder.name} founder={founder} index={i} />
            ))}
          </div>

          <FadeIn delay={0.2}>
            <div className="mt-12 p-10 rounded-2xl border border-ink/10 bg-white/60 text-center">
              <p className="font-display text-xl md:text-2xl text-ink leading-snug max-w-2xl mx-auto">
                &quot;Food should nourish the body, respect our values, and be something we can{" "}
                <span className="text-turmeric font-semibold">trust every day.</span>&quot;
              </p>
              <p className="mt-5 font-label text-sm text-ink/35 tracking-widest uppercase">— Dr. Shikha Jain & Diksha Kumari</p>
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}