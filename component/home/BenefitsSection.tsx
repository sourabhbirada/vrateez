import Image from 'next/image';

const BENEFITS = [
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Energy+bar+closeup.jpeg',
        title: 'Vrat Friendly',
        subtitle: 'Always',
        bg: 'bg-millet/20',
    },
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Cashew+cookies+in+plate+along+with+box.jpeg',
        title: 'No Fillers &',
        subtitle: 'No Palm Oil',
        bg: 'bg-turmeric/15',
    },
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Blueberry+cookies.jpeg',
        title: 'Clean Label',
        subtitle: 'Ingredients',
        bg: 'bg-clay/15',
    },
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Energy+bar.jpeg',
        title: 'Gut &',
        subtitle: 'Wellness Support',
        bg: 'bg-basil/10',
    },
    {
        image: 'https://vrateez.s3.ap-south-1.amazonaws.com/Almond+cookies+in+plate.jpeg',
        title: 'Tradition Meets',
        subtitle: 'Innovation',
        bg: 'bg-ink/5',
    },
];

export default function BenefitsSection() {
    return (
        <section className="py-16 md:py-20 bg-parchment">
            <div className="max-w-7xl mx-auto px-8">
                <div className="text-center mb-14">
                    <p className="font-label text-[11px] tracking-[0.25em] text-clay uppercase mb-3">Our Promise</p>
                    <h2 className="font-display italic text-3xl md:text-4xl text-ink mb-3 tracking-tight">
                        Why Choose Vrateez?
                    </h2>
                    <p className="text-ink/50 max-w-lg mx-auto text-sm leading-relaxed">
                        We don&apos;t just make food — we create a healthier, more trustworthy way of eating.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-6">
                    {BENEFITS.map((b) => (
                        <div key={b.title} className="flex flex-col items-center text-center group">
                            <div className={`w-28 h-28 md:w-32 md:h-32 rounded-full ${b.bg} overflow-hidden mb-5 group-hover:scale-105 transition-transform duration-300 border border-ink/10`}>
                                <Image
                                    src={b.image}
                                    alt={`${b.title} ${b.subtitle}`}
                                    width={160}
                                    height={160}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-sm font-bold text-ink leading-snug">{b.title}</h3>
                            <p className="text-sm font-bold text-ink leading-snug">{b.subtitle}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}