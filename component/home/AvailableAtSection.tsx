export default function AvailableAtSection() {
    const partners = [
        { name: 'amazon', style: 'text-2xl font-bold text-gray-900 italic' },
        { name: 'Flipkart', style: 'text-xl font-bold text-[#047BD5]' },
        { name: 'zepto', style: 'bg-[#8B1874] text-white px-5 py-2.5 text-base font-bold rounded-xl' },
        { name: 'HealthKart', style: 'text-lg font-bold text-[#00A699]' },
        { name: "Nature's Basket", style: 'text-lg font-semibold text-gray-700' },
        { name: 'Blinkit', style: 'bg-yellow-400 text-gray-900 px-5 py-2.5 text-base font-bold rounded-xl' },
    ];

    return (
        <section className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-8">
                {/* Message */}
                <div className="text-center mb-6">
                    <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        At Vrateez, we believe you shouldn&apos;t have to choose between tasty and healthy.
                        Our nutritionist-approved snacks prove you can have the best of both worlds.
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
