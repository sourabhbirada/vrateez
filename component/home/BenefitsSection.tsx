import Image from 'next/image';

const benefits = [
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Energy+bar+closeup.jpeg',
        title: 'Vrat Friendly',
        subtitle: 'Always',
        bg: 'bg-amber-50',
    },
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Cashew+cookies+in+plate+along+with+box.jpeg',
        title: 'No Fillers &',
        subtitle: 'No Palm Oil',
        bg: 'bg-[#FFF3CD]',
    },
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Blueberry+cookies.jpeg',
        title: 'Clean Label',
        subtitle: 'Ingredients',
        bg: 'bg-[#FCE4EC]',
    },
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Energy+bar.jpeg',
        title: 'Gut &',
        subtitle: 'Wellness Support',
        bg: 'bg-[#D7CCC8]',
    },
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Almond+cookies+in+plate.jpeg',
        title: 'Tradition Meets',
        subtitle: 'Innovation',
        bg: 'bg-[#FFF8E1]',
    },
];

const ingredients = [
    {
        name: 'Amaranth (Rajgira)',
        emoji: '🌾',
        traditional: 'Sacred, strength-giving grain used during fasting for energy, purity, and nourishment.',
        science: 'Complete protein; rich in iron, calcium, antioxidants; supports muscle health and energy.',
    },
    {
        name: 'Barnyard Millet (Sama)',
        emoji: '🌿',
        traditional: 'Light, easily digestible, sattvic; supports balance and digestion during fasting.',
        science: 'Low GI; high fiber; supports blood sugar control and gut health.',
    },
    {
        name: 'Singhada (Water Chestnut Flour)',
        emoji: '💧',
        traditional: 'Cooling, strength-giving food used during fasting.',
        science: 'Rich in potassium and antioxidants; supports hydration; gluten-free.',
    },
    {
        name: 'Blueberry',
        emoji: '🫐',
        traditional: 'Vibrant fruits considered nourishing and vitality-enhancing.',
        science: 'High antioxidants; supports brain health, immunity, reduces oxidative stress.',
    },
    {
        name: 'Nuts & Seeds',
        emoji: '🥜',
        traditional: 'Consumed for strength, clarity, and vitality.',
        science: 'Rich in healthy fats, protein; supports heart and brain; long-lasting energy.',
    },
];

export default function BenefitsSection() {
    return (
        <>
            {/* ─── Why Choose Vrateez ─── */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-14">
                        <p className="text-[11px] font-semibold tracking-[0.25em] text-amber-700 uppercase mb-3">Our Promise</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 mb-3 tracking-tight">
                            Why Choose Vrateez?
                        </h2>
                        <p className="text-stone-500 max-w-lg mx-auto text-sm">
                            We don't just make food — we create a healthier, more trustworthy way of eating.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-6">
                        {benefits.map((b, i) => (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full ${b.bg} overflow-hidden mb-5 group-hover:scale-105 transition-transform duration-300 shadow-sm border border-stone-100`}>
                                    <Image
                                        src={b.image}
                                        alt={`${b.title} ${b.subtitle}`}
                                        width={160}
                                        height={160}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="text-sm font-bold text-stone-900 leading-snug">{b.title}</h3>
                                <p className="text-sm font-bold text-stone-900 leading-snug">{b.subtitle}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </section>

            {/* ─── Our Philosophy ─── */}

        </>
    );
}