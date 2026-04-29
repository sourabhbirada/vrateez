export default function AvailableAtSection() {
    const partners = [
        { name: 'amazon', style: 'text-2xl font-bold text-gray-900 italic' },
        { name: 'zepto', style: 'bg-[#8B1874] text-white px-5 py-2.5 text-base font-bold rounded-xl' },
        { name: 'Blinkit', style: 'bg-yellow-400 text-gray-900 px-5 py-2.5 text-base font-bold rounded-xl' },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-8">
                {/* Message */}
                <div className="text-center mb-6">
                    <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        In today's busy life, finding food that is healthy, pure, and ready to eat instantly feels like a difficult balance. Vrateez walks beside you — crafted for every moment, built on tradition, backed by science
                    </p>
                </div>

                <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 mb-12">
                    ALSO AVAILABLE AT
                </h2>

                {/* Partner logos */}
                <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap">
                    {partners.map((p, i) => (
                        <div key={i} className={`${p.style} hover:opacity-80 transition-opacity cursor-default`}>
                            {p.name}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
