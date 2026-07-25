export default function AvailableAtSection() {
    const partners = [
        { name: 'amazon', style: 'text-2xl font-bold text-ink italic' },
        { name: 'zepto', style: 'bg-clay text-parchment px-5 py-2.5 text-base font-bold rounded-xl' },
        { name: 'Blinkit', style: 'bg-millet text-ink px-5 py-2.5 text-base font-bold rounded-xl' },
    ];

    return (
        <section className="py-20 bg-parchment">
            <div className="max-w-5xl mx-auto px-8">
                {/* Message */}
                <div className="text-center mb-6">
                    <p className="text-ink/50 max-w-2xl mx-auto leading-relaxed text-sm">
                        In today&apos;s busy life, finding food that is healthy, pure, and ready to eat instantly feels like a difficult balance. Vrateez walks beside you — crafted for every moment, built on tradition, backed by science.
                    </p>
                </div>

                <h2 className="font-display italic text-2xl md:text-3xl text-center text-ink mb-12">
                    Also Available At
                </h2>

                {/* Partner logos */}
                <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
                    {partners.map((p) => (
                        <div key={p.name} className={`${p.style} hover:opacity-80 transition-opacity cursor-default`}>
                            {p.name}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}